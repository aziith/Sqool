require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setupSyllabus() {
    const client = await pool.connect();
    try {
        console.log("Setting up Syllabuses and Topics tables...");
        
        // 1. Syllabuses Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS syllabuses (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
                class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
                subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
                assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("- Syllabuses table ready");

        // 2. Topics Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS topics (
                id SERIAL PRIMARY KEY,
                syllabus_id INTEGER REFERENCES syllabuses(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completion_status BOOLEAN DEFAULT FALSE,
                completion_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("- Topics table ready");

        console.log("Setup completed successfully!");
    } catch (err) {
        console.error("Error setting up syllabus tables:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

setupSyllabus();
