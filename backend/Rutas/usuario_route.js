import { Router } from 'express';
import { loginUsuario, logout, obtenerUsuarios, registrarUsuario } from '../Controladores/usuario_controller.js';
import { autenticar } from '../Middleware/autenticacion.js';
import { obtenerPerfil } from '../Controladores/usuario_controller.js';
import { verificarToken } from '../Middleware/autenticacion.js';

const router = Router();
router.get('/', obtenerUsuarios);
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);
router.post('/logout', verificarToken, logout);

export default router;