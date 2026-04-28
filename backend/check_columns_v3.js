const { Pool } = require('pg');
require('dotenv').config({ path: 'd:/Education Track/backend/.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
    try {
        const res = await pool.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_name IN ('exam_schedules', 'exam_results')");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
check();
