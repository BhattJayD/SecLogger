const mariadb = require('mariadb');
require('dotenv').config();
// Create a pool of connections to the MariaDB database
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    acquireTimeout: process.env.DB_ACQUIRE_TIMEOUT,
});
const insertLog = async (log) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * from logs");
        // const query = `
        //     INSERT INTO logs (req)
        //     VALUES (?)
        // `;
        console.log(rows, 'rows');

        // await conn.query(query,log);
    } catch (err) {
        console.error('Error inserting log:', err);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = { insertLog };
