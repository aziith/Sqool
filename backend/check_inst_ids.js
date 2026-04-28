require('dotenv').config();
const { pool } = require('./src/config/db');

const checkUsers = async () => {
    try {
        const res = await pool.query('SELECT DISTINCT institution_id FROM users');
        console.log('Institution IDs in use:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
};

checkUsers();
