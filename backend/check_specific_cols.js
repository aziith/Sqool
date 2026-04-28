require('dotenv').config();
const { pool } = require('./src/config/db');

const check = async () => {
    try {
        const fields = ['address', 'current_address', 'guardian_id_proof', 'student_id_proof'];
        for (const field of fields) {
            const res = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'admissions' AND column_name = $1
            `, [field]);
            console.log(`Field ${field}: ${res.rows.length > 0 ? 'EXISTS' : 'MISSING'}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

check();
