import * as homeService from '../servicios/home_service.js';

export async function obtenerListadoCursosGeneral(req, res) {
    try {
        const cursos = await homeService.obtenerListadoCursosGeneral();
        return res.json(cursos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el listado de cursos' });
    }
}

export async function listadoCursosEstudianteHome(req, res) {
    try {
        const id = req.usuario.id;

        const resultado =
            await homeService.listadoCursosEstudianteHome(id);

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error al obtener los cursos del estudiante"
        });
    }
}

export async function listadoEjerciciosCurso(req, res) {
    try {
        const cursoId = req.params.curso_id;

        const resultado =
            await homeService.listadoEjerciciosCurso(cursoId);

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error al obtener los ejercicios del curso"
        });
    }
}

export async function listadoEjerciciosGeneral(req, res) {
    try {
        const cursos = await homeService.listadoEjerciciosGeneral();
        return res.json(cursos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el listado de cursos' });
    }
}


export async function listadoEjerciciosHome(req, res) {
    try {
        const usuario_id = req.usuario.id;
        const resultado = await homeService.listadoEjerciciosHome(usuario_id);

        return res.status(200).json(resultado);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener los ejercicios en progreso' });
    }
}

export async function inscribirUsuarioCurso(req, res) {
    try {
        const usuario_id = req.usuario.id;
        const curso_id = req.params.curso_id;

        if (!usuario_id || !curso_id) {
            return res.status(404).json({ error: 'Usuario o curso no encontrado' })
        }

        const resultado = await homeService.inscribirUsuarioCurso(usuario_id, curso_id);

        if (!resultado) {
            return res.status(404).json({ error: 'No se pudo procesar la inscripción. Verifique los datos o la disponibilidad del curso.' })
        }


        return res.status(201).json({
            message: "Usuario inscrito correctamente"
        });
    }

    catch (error) {
        console.error('Error al inscribir usuario:', error);

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                error: 'Ya estás inscrito en este curso.'
            });
        }

        if (error.message === 'CURSO_NO_EXISTE') {
            return res.status(404).json({
                error: 'El curso especificado no existe.'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            return res.status(400).json({
                error: 'No se pudo completar la inscripción con los datos proporcionados.'
            });
        }

        return res.status(500).json({
            error: 'Ocurrió un error al intentar inscribirse al curso.'
        });
    }
}


export async function obtenerEjercicio(req, res) {
    try {
        const id = req.params.ejercicio_id;

        const ejercicio = await homeService.obtenerEjercicio(id);

        if (!ejercicio) {
            return res.status(404).json({
                error: "Ejercicio no encontrado"
            });
        }

        return res.status(200).json(ejercicio);

    } catch (error) {
        console.error("Error al obtener ejercicio:", error);

        return res.status(500).json({
            error: "Error al obtener el ejercicio"
        });
    }
}