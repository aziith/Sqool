require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function testConnection() {
    console.log("Testing connection to:", process.env.DATABASE_URL);
    try {
        const start = Date.now();
        const res = await pool.query('SELECT NOW()');
        console.log("Connection successful!", res.rows[0]);
        console.log("Time taken:", Date.now() - start, "ms");
    } catch (err) {
        console.error("Connection failed!", err);
    } finally {
        await pool.end();
    }
}

testConnection();
