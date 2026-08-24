import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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


