import { Router } from 'express';
import { verificarToken } from '../middleware/autenticacion.js';
import { listadoCursosEstudianteHome, listadoEjerciciosGeneral, listadoEjerciciosHome, listadoEjerciciosPorCurso, obtenerListadoCursosGeneral } from '../controladores/home_controller.js';

const Homerouter = Router();

// router.get('/home', )
Homerouter.get('/api/home/cursos', obtenerListadoCursosGeneral);
Homerouter.get('/api/home/mis-cursos', listadoCursosEstudianteHome);
Homerouter.get('/api/home/cursos/:curso_id/ejercicios', listadoEjerciciosPorCurso);
Homerouter.get('/api/home/ejercicios', listadoEjerciciosGeneral);
Homerouter.get('/api/home/en-progreso', listadoEjerciciosHome);

export default Homerouter;