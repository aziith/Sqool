const { pool } = require('./src/config/db');

async function test() {
    const resA = await pool.query('SELECT application_no FROM admissions LIMIT 5');
    console.log("Admissions:", resA.rows);
    const resS = await pool.query('SELECT application_no FROM students LIMIT 5');
    console.log("Students:", resS.rows);
    process.exit(0);
}
test();
