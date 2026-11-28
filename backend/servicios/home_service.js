import pool from '../config/db.js';

//CURSOS
export async function obtenerListadoCursosGeneral() {
    const [resultado] = await pool.query(
        'SELECT id, titulo, descripcion, orden FROM cursos ORDER BY orden ASC;'
    );

    return resultado;
}

export async function listadoCursosEstudianteHome(id) {
    const [resultado] = await pool.query(
        `
        SELECT c.id, c.titulo, c.descripcion, c.orden
        FROM cursos c
        INNER JOIN usuarios_cursos uc
            ON c.id = uc.curso_id
        WHERE uc.usuario_id = ?
        ORDER BY c.orden ASC
        `,
        [id]
    );

    return resultado;
}

//EJERCICIOS
export async function listadoEjerciciosCurso(cursoId) {
    const [resultado] = await pool.query(
        `SELECT id, curso_id, titulo, instrucciones, codigo_inicial, orden
        FROM ejercicios
        WHERE curso_id = ?
        ORDER BY orden ASC`,
        [cursoId]
    );

    return resultado;
}

export async function listadoEjerciciosGeneral() {
    const [resultado] = await pool.query(
        `
        SELECT e.id e.titulo, e.orden
        FROM ejercicios e
        `
    )
    return resultado;
}

export async function listadoEjerciciosHome(id) {
    const [resultado] = await pool.query(
        `SELECT
            e.titulo,
            e.codigo_inicial,
            e.orden,
            p.completado
        FROM ejercicios e
        INNER JOIN progreso_ejercicios p
            ON e.id = p.ejercicio_id
        WHERE p.usuario_id = ?
        AND p.completado = 0`,
        [id]
    );
    return resultado;
}

//DOCUMENTACION 

///MAS ADELANTE HARE UNA TABLA PARA GUARDAR DOCUMENTACION CREADA POR LOS PROFESORES
// EN LUGAR DE ALGO QUE SE OBTIENE DE INTERNET. 

export async function inscribirUsuarioCurso(usuario_id, curso_id) {
    const [cursos] = await pool.query(
        'SELECT id FROM cursos WHERE id = ?',
        [curso_id]
    );

    if (cursos.length === 0) {
        throw new Error('CURSO_NO_EXISTE');
    }

    const [resultado] = await pool.query(
        `
        INSERT INTO usuarios_cursos (usuario_id, curso_id) VALUES (?, ?)
        `,
        [usuario_id, curso_id]
    );

    return resultado;
}

export async function obtenerEjercicio(id) {
    const [ejercicios] = await pool.query(
        `SELECT id, curso_id, titulo, instrucciones, orden
        FROM ejercicios
        WHERE id = ?
        LIMIT 1`,
        [id]
    );

    if (!ejercicios[0]) {
        return null;
    }

    const [lenguajes] = await pool.query(
        `SELECT l.id, l.nombre, l.slug, el.codigo_inicial, el.orden
        FROM ejercicio_lenguajes el
        INNER JOIN lenguajes l
            ON l.id = el.lenguaje_id
        WHERE el.ejercicio_id = ?
        ORDER BY el.orden`,
        [id]
    );

    return {
        ...ejercicios[0],
        lenguajes
    };
}


export async function obtenerProgresoEjercicio(usuarioId, ejercicioId) {
    const [progresos] = await pool.query(
        `SELECT
            id,
            usuario_id,
            ejercicio_id,
            completado,
            completado_en,
            actualizado_en
        FROM progreso_ejercicios
        WHERE usuario_id = ?
        AND ejercicio_id = ?
        LIMIT 1`,
        [usuarioId, ejercicioId]
    );

    if (!progresos[0]) {
        return null;
    }

    const progreso = progresos[0];

    const [codigos] = await pool.query(
        `SELECT l.slug AS lenguaje, l.nombre, pc.codigo
        FROM progreso_codigo pc
        INNER JOIN lenguajes l
            ON l.id = pc.lenguaje_id
        WHERE pc.progreso_id = ?
        ORDER BY l.id`,
        [progreso.id]
    );

    return {
        ...progreso,
        codigos
    };
}


export async function guardarProgresoEjercicio(
    usuarioId,
    ejercicioId,
    codigos
) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [resultado] = await connection.query(
            `INSERT INTO progreso_ejercicios (
                usuario_id,
                ejercicio_id
            )
            VALUES (?, ?)

            ON DUPLICATE KEY UPDATE
                id = LAST_INSERT_ID(id),
                actualizado_en = CURRENT_TIMESTAMP`,
            [usuarioId, ejercicioId]
        );

        const progresoId = resultado.insertId;

        for (const item of codigos) {
            const [lenguajes] = await connection.query(
                `SELECT id
                FROM lenguajes
                WHERE slug = ?
                LIMIT 1`,
                [item.lenguaje]
            );

            if (!lenguajes[0]) {
                throw new Error(
                    `LENGUAJE_INVALIDO:${item.lenguaje}`
                );
            }

            await connection.query(
                `INSERT INTO progreso_codigo ( progreso_id, lenguaje_id, codigo)VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE codigo = VALUES(codigo)`,
                [progresoId, lenguajes[0].id, item.codigo ?? ""]
            );
        }

        await connection.commit();

        return await obtenerProgresoEjercicio(
            usuarioId,
            ejercicioId
        );

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}