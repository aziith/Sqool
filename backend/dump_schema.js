require('dotenv').config();
const { pool } = require('./src/config/db');
const fs = require('fs');

async function dumpSchema() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'admissions'");
        const columns = res.rows.map(r => r.column_name).join('\n');
        fs.writeFileSync('D:/Education Track/backend/full_schema.txt', columns);
        console.log("Full schema dumped to full_schema.txt");
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
        process.exit();
    }
}

dumpSchema();
