import * as usuarioService from '../Servicios/usuario_service.js';

export async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios\n' });
    }
};

export async function registrarUsuario(req, res) {
    const { username, nombre, correo, password } = req.body;

    if (!username || !nombre || !correo || !password) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    try {
        const usuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {

        if (error.errno === 1062) {
            return res.status(409).json({ error: "Un usuario con ese correo electrónico ya existe." });
        }

        console.error("Error con la base de datos: ", error);
        return res.status(500).json({ error: "Error interno. Por favor intente luego nuevamente." });
    }
};

export async function loginUsuario(req, res) {
    const { identificador, password } = req.body;

    if (!identificador || !password) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    try {
        const resultado = await usuarioService.loginUsuario(
            identificador,
            password
        );

        res.cookie('token', resultado.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        return res.status(200).json({
            usuario: resultado.usuario
        });

    } catch (error) {
        if (error.message === 'CREDENCIALES_INVALIDAS') {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export async function obtenerPerfil(req, res) {
    const id = req.usuario.id;

    try {
        const resultado = await usuarioService.obtenerPerfil(id);
        if (!resultado) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }
        return res.status(200).json(resultado)

    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Usuario no encontrado" });

    }
};

export async function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    return res.status(200).json({
        mensaje: 'Sesión cerrada correctamente'
    })
};


