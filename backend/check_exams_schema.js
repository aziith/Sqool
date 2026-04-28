require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkExamsColumns() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'exams'
        `);
        console.log('--- Exams Table Columns ---');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkExamsColumns();
