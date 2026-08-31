import { Router } from 'express';
import { loginUsuario, logout, obtenerUsuarios, registrarUsuario } from '../controladores/usuario_controller.js';
import { autenticar } from '../middleware/autenticacion.js';
import { obtenerPerfil } from '../controladores/usuario_controller.js';
import { verificarToken } from '../middleware/autenticacion.js';
import { olvidoContraseña } from '../servicios/usuario_service.js';


const router = Router();
// router.get('/', obtenerUsuarios);
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);
router.post('/logout', verificarToken, logout);
router.post('/olvido_contraseña', olvidoContraseña);

export default router;