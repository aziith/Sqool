const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        console.log('Starting manual migration...');
        
        // 1. Update teachers table
        console.log('Updating teachers table...');
        await pool.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subjects VARCHAR(200)');
        await pool.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone VARCHAR(20)');
        await pool.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT');
        
        // 2. Create staffs table if it doesn't exist
        console.log('Creating staffs table if missing...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS staffs (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                employee_id VARCHAR(100) UNIQUE,
                role VARCHAR(50) NOT NULL,
                department VARCHAR(100),
                subjects VARCHAR(200),
                institution_id INTEGER,
                photo_url VARCHAR(255),
                phone VARCHAR(20),
                address TEXT,
                qualification VARCHAR(255),
                joining_date DATE
            )
        `);

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
