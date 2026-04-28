const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const createTable = async () => {
    try {
        console.log('Creating otp_verifications table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS otp_verifications (
                id SERIAL PRIMARY KEY,
                identifier VARCHAR(255) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_otp_identifier ON otp_verifications(identifier);
        `);
        console.log('otp_verifications table created successfully!');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await pool.end();
    }
};

createTable();
