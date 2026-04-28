require('dotenv').config();
const { pool } = require('./src/config/db');

const addTestClass = async () => {
    try {
        const res = await pool.query(`
            INSERT INTO classes (institution_id, name, section, capacity)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [1, 'Grade 10', 'A', 40]);
        console.log('Test class added:', JSON.stringify(res.rows[0], null, 2));
    } catch (err) {
        console.error('FULL ERROR:', err);
        if (err.detail) console.error('DETAIL:', err.detail);
        if (err.hint) console.error('HINT:', err.hint);
    } finally {
        process.exit();
    }
};

addTestClass();
