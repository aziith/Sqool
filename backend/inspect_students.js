require('dotenv').config();
const { pool } = require('./src/config/db');

const inspectStudents = async () => {
    try {
        const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students'");
        console.log('STUDENTS_COLUMNS_START');
        res.rows.forEach(r => console.log(r.column_name));
        console.log('STUDENTS_COLUMNS_END');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

inspectStudents();
