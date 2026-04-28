const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    try {
        console.log('Adding institution_id to teachers...');
        await pool.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS institution_id INTEGER');
        console.log('Done');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
