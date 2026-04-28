require('dotenv').config();
const { pool } = require('./src/config/db');

async function testInsert() {
    try {
        const res = await pool.query(
            "INSERT INTO classes (name, section) VALUES ('Test Class', 'T') RETURNING *"
        );
        console.log('Inserted:', res.rows[0]);
        const count = await pool.query("SELECT COUNT(*) FROM classes");
        console.log('Count now:', count.rows[0].count);
    } catch (err) {
        console.error('Insert failed:', err);
    } finally {
        process.exit();
    }
}

testInsert();
