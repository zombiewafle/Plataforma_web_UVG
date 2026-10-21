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
        {
            id: usuario.id,
            rol: usuario.rol
        },
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



export async function olvidoContraseña(identificador) {
    const usuario = await buscarPorCorreo(identificador);

    if (!usuario) {
        throw new Error('CREDENCIALES_INVALIDAS');
    }

    const token = jwt.sign(
        { sub: usuario.id, purpose: "password_reset" },
        process.env.JWT_SECRET,
        {
            expiresIn: '10m',
            algorithm: 'HS256'
        }
    );

    const enlace = `https://aprendewebgt.lat/usuarios/reset-password/${token}`;
    ///enviar correo 
}

export async function obtenerDatosPerfil(id) {
    const [usuario] = await pool.query(
        'SELECT username, nombre, correo, rol FROM usuarios WHERE id = ? LIMIT 1', [id]
    );
    return usuario[0];
}

export async function cambiarDatosPerfil(id, { nombre, correo }) {
    const campos = [];
    const valores = [];

    if (nombre !== undefined) {
        campos.push('nombre = ?');
        valores.push(nombre);
    }

    if (correo !== undefined) {
        campos.push('correo = ?');
        valores.push(correo);
    }

    if (campos.length === 0) {
        throw new Error('SIN_DATOS');
    }

    valores.push(id);

    await pool.query(
        `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores
    );

    return await obtenerDatosPerfil(id);
}