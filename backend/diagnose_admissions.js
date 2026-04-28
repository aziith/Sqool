require('dotenv').config();
const { pool } = require('./src/config/db');

const diagnose = async () => {
    try {
        const columns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admissions'");
        console.log('Admissions Columns:', JSON.stringify(columns.rows, null, 2));
    } catch (err) {
        console.error('Diagnosis failed:', err);
    } finally {
        process.exit();
    }
};

diagnose();
