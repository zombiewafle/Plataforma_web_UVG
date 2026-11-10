import { Router } from 'express';
import { verificarToken } from '../middleware/autenticacion.js';
import { listadoCursosEstudianteHome, listadoEjerciciosGeneral, listadoEjerciciosHome, listadoEjerciciosPorCurso, obtenerListadoCursosGeneral, inscribirUsuarioCurso } from '../controladores/home_controller.js';

const Homerouter = Router();

// router.get('/home', )
Homerouter.get('/cursos', obtenerListadoCursosGeneral);
Homerouter.get('/mis-cursos', verificarToken, listadoCursosEstudianteHome);
Homerouter.get('/cursos/:curso_id/ejercicios', listadoEjerciciosPorCurso);
Homerouter.get('/ejercicios', listadoEjerciciosGeneral);
Homerouter.get('/en-progreso', verificarToken, listadoEjerciciosHome);
Homerouter.post('/cursos/:curso_id/inscripcion', inscribirUsuarioCurso);

export default Homerouter;