import { Router } from 'express';
import { loginUsuario, obtenerUsuarios, registrarUsuario } from '../Controladores/usuario_controller.js';
import { autenticar } from '../Middlewares/autenticacion.js';

const router = Router();
router.get('/', obtenerUsuarios);
router.post('/registro', registrarUsuario)
router.post('/login', loginUsuario)

export default router;