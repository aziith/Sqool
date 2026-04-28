const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    try {
        console.log('Adding room_number to classes...');
        await pool.query('ALTER TABLE classes ADD COLUMN IF NOT EXISTS room_number VARCHAR(100)');
        console.log('Done');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
