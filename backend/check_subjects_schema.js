require('dotenv').config();
const { pool } = require('./src/config/db');

const check = async () => {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'subjects'
        `);
        console.log('Subjects Columns:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

check();
