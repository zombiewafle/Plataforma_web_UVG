import { Router } from 'express';

import {
    olvido_contraseña,
    restablecerContraseña,
    cambiarDatosPerfil,
    loginUsuario,
    logout,
    obtenerDatosPerfil,
    obtenerPerfil,
    obtenerUsuarios,
    registrarUsuario
} from '../controladores/usuario_controller.js';

import { verificarToken } from '../middleware/autenticacion.js';

const router = Router();
// router.get('/', obtenerUsuarios);
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
// router.get('/perfil', verificarToken, obtenerPerfil);
router.get('/perfil', verificarToken, obtenerDatosPerfil)
router.patch('/perfil', verificarToken, cambiarDatosPerfil)
router.post('/logout', verificarToken, logout);
router.post('/olvido-contrasena', olvido_contraseña);
router.post('/restablecer-contrasena', restablecerContraseña);


export default router;