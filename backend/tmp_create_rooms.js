const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    try {
        console.log('Creating rooms table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
                room_number VARCHAR(100) NOT NULL,
                room_type VARCHAR(50) DEFAULT 'CLASSROOM',
                capacity INTEGER DEFAULT 40,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created rooms table.');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
