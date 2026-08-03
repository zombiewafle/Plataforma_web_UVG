//Este archivo sirve para configurar la conexión con la db.

import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'plataforma_app',
    password: 'Enanito1998',
    database: 'plataforma_uvg',
});

export default pool;