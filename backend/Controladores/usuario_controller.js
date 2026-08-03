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
        console.error(error);

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
        const usuario = await usuarioService.loginUsuario(identificador, password);
        console.log("Logeo exitoso")
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};