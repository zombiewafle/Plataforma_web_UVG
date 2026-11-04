import pool from '../config/db.js';

//CURSOS
export async function obtenerListadoCursosGeneral() {
    const [resultado] = await pool.query(
        'SELECT id, titulo, descripcion, orden FROM cursos ORDER BY orden ASC;'
    );

    return resultado;
}

async function listadoCursosEstudianteHome(usuario_id) {
    const [resultado] = await pool.query(
        `
        SELECT c.id, c.titulo, c.descripcion, c.orden
        FROM usuarios_cursos uc
        INNER JOIN cursos c ON uc.curso_id = c.id
        WHERE uc.usuario_id = ?
        ORDER BY c.orden ASC, c.id ASC
        LIMIT 3
        `,
        [usuario_id]
    );

    return resultado;
}

//EJERCICIOS
export async function listadoEjerciciosPorCurso(curso_id) {
    const [resultado] = await pool.query(
        `
        SELECT e.titulo AS ejercicio_titulo, e.instrucciones, e.codigo_inicial, e.orden AS ejercicio_orden, c.titulo AS curso_titulo, c.orden AS  curso_orden
        FROM ejercicios e
        INNER JOIN cursos c ON e.curso_id = c.id
        WHERE c.id = ?
        `, [curso_id]
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
        `
        SELECT e.titulo, e.codigo_inicial, e.orden, p.completado, p.completado  
        FROM ejercicios e
        INNER JOIN progreso_ejercicios p ON e.id = p.ejercicio_id
        p.usuario_id = ? AND p.completado = 0
        `, [id]
    );
    return resultado;
}

//DOCUMENTACION 

///MAS ADELANTE HARE UNA TABLA PARA GUARDAR DOCUMENTACION CREADA POR LOS PROFESORES
// EN LUGAR DE ALGO QUE SE OBTIENE DE INTERNET. 

export async function inscribirUsuarioCurso(usuario_id, curso_id) {
    const [resultado] = await pool.query(
        `
        INSERT INTO usuarios_cursos (usuario_id, curso_id) VALUES (?, ?)
        `,
        [usuario_id, curso_id]
    );

    return resultado;
}