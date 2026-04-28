const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    try {
        console.log('Adding experience_years...');
        await pool.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience_years INTEGER');
        console.log('Done');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
