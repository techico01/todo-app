import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'todo_calendar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}