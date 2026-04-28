const { pool } = require('./src/config/db');
require('dotenv').config();

const test = async () => {
    try {
        const res = await pool.query('SELECT * FROM classes');
        console.log('Classes found:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        process.exit();
    }
};

test();
