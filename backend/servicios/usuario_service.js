import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { correoService } from './correo_service.js';


//FUNCIONES AUXILIARES PARA LOS USUARIOS 
async function buscarPorCorreo(identificador_de_usuario) {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE username = ? OR correo = ?', [identificador_de_usuario, identificador_de_usuario]
    );
    return rows[0];

}


export async function obtenerUsuarios() {
    const [rows] = await pool.query(
        'SELECT id, username, nombre, correo, rol, creado_en FROM usuarios'
    );
    return rows;
}


export async function registrarUsuario({ username, nombre, correo, password }) {
    const psswHash = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
        'INSERT INTO usuarios (username, nombre, correo, password_hash) VALUES (?,?,?,?)', [username, nombre, correo, psswHash]
    );

    return { id: resultado.insertId, username, nombre, correo };
}


export async function loginUsuario(identificador, password) {
    const usuario = await buscarPorCorreo(identificador);

    if (!usuario) {
        throw new Error('CREDENCIALES_INVALIDAS');
    }

    const passwd_correcta = await bcrypt.compare(password, usuario.password_hash);

    if (!passwd_correcta) {
        throw new Error('CREDENCIALES_INVALIDAS');
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
            algorithm: 'HS256'
        }
    );

    const { password_hash, ...usuarioSinPassword } = usuario;
    return { usuario: usuarioSinPassword, token };
}


export async function obtenerPerfil(id) {
    const [resultado] = await pool.query(
        'SELECT id, username, nombre, correo, rol, creado_en FROM usuarios WHERE id = ? LIMIT 1', [id]
    );
    return resultado[0];

}


export async function olvidoContraseñaToken(correo) {
    const usuario = await buscarPorCorreo(correo);

    if (!usuario) {
        return { message: "Si el correo existe, se enviará un enlace de recuperación." };
    }

    const randToken = crypto.randomBytes(32).toString('hex');
    const randTokenHash = crypto.createHash('sha256').update(randToken).digest('hex');
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
        'INSERT INTO password_reset_tokens (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)',
        [usuario.id, randTokenHash, expiresIn]
    );

    const enlace = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${randToken}`;

    try {
        await correoService.emails.send({
            from: "AprendeWebGT <no-reply@aprendewebgt.lat>",
            to: correo,
            subject: 'Restablecer contraseña',
            html: `Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña. Este enlace expira en 10 minutos.`
        });

        return {
            message: "Si el correo existe, se enviará un enlace de recuperación."
        };

    } catch (error) {
        console.error('Error al enviar el correo: ', error);
    }

}

export async function restablecerContraseña(tokenCrudo, nuevaPassword) {

    const tokenHash = crypto.createHash('sha256').update(tokenCrudo).digest('hex');

    const [revision] = await pool.query(
        `SELECT usuario_id FROM password_reset_tokens WHERE token_hash = ? AND usado_en IS NULL AND expira_en > NOW() LIMIT 1`,
        [tokenHash]
    );

    if (!revision[0]) {
        throw new Error('TOKEN_INVALIDO');
    }

    const usuarioId = revision[0].usuario_id;
    const connection = await pool.getConnection();
    const nuevaPasswordHash = await bcrypt.hash(nuevaPassword, 10);

    try {
        await connection.beginTransaction();

        const [usuarios] = await connection.query('SELECT id FROM usuarios WHERE id = ? FOR UPDATE', [usuarioId]);

        if (!usuarios[0]) {
            throw new Error('TOKEN_INVALIDO');
        }

        const [tokens] = await connection.query(`SELECT id, usuario_id FROM password_reset_tokens WHERE token_hash = ? AND usuario_id = ? AND usado_en IS NULL AND expira_en > NOW() LIMIT 1 FOR UPDATE`,
            [tokenHash, usuarioId]
        );

        if (!tokens[0]) {
            throw new Error('TOKEN_INVALIDO');
        }

        await connection.query(`UPDATE usuarios SET password_hash = ? WHERE id = ?`,
            [nuevaPasswordHash, usuarioId]
        );
        await connection.query(`UPDATE password_reset_tokens SET usado_en = NOW() WHERE usuario_id = ? AND usado_en IS NULL`,
            [usuarioId]
        );

        await connection.commit();

        return {
            message: 'Contraseña actualizada correctamente.'
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}


