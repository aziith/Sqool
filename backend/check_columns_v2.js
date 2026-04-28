const { Pool } = require('pg');
require('dotenv').config({ path: 'd:/Education Track/backend/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function check() {
    try {
        const tables = ['exam_schedules', 'exam_results'];
        for (const table of tables) {
            const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}'`);
            console.log(`Table ${table} columns:`, res.rows.map(r => r.column_name).join(', '));
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
check();
