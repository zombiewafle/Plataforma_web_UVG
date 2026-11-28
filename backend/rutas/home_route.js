import { Router } from 'express';
import { verificarToken } from '../middleware/autenticacion.js';
import {
    listadoCursosEstudianteHome,
    listadoEjerciciosGeneral,
    listadoEjerciciosHome,
    listadoEjerciciosCurso,
    obtenerListadoCursosGeneral,
    inscribirUsuarioCurso,
    obtenerEjercicio,
    obtenerProgresoEjercicio,
    guardarProgresoEjercicio,
    entregarEjercicio,
    retirarEntrega
} from '../controladores/home_controller.js';

const Homerouter = Router();

// router.get('/home', )
Homerouter.get('/cursos', obtenerListadoCursosGeneral);
Homerouter.get('/mis-cursos', verificarToken, listadoCursosEstudianteHome);
Homerouter.get('/cursos/:curso_id/ejercicios', verificarToken, listadoEjerciciosCurso);
Homerouter.get('/ejercicios', listadoEjerciciosGeneral);
Homerouter.get('/en-progreso', verificarToken, listadoEjerciciosHome);
Homerouter.post('/cursos/:curso_id/inscripcion', verificarToken, inscribirUsuarioCurso);
Homerouter.get('/ejercicios/:ejercicio_id', verificarToken, obtenerEjercicio);
Homerouter.get("/ejercicios/:ejercicio_id/progreso", verificarToken, obtenerProgresoEjercicio);
Homerouter.put("/ejercicios/:ejercicio_id/progreso", verificarToken, guardarProgresoEjercicio);
Homerouter.patch('/ejercicios/:ejercicio_id/entregar', verificarToken, entregarEjercicio);
Homerouter.patch('/ejercicios/:ejercicio_id/retirar-entrega', verificarToken, retirarEntrega);



export default Homerouter;