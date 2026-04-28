const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const setupAcademic = async () => {
    const client = await pool.connect();
    try {
        console.log("Starting Academic Database Setup...");

        // 1. Classes Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                section VARCHAR(100),
                capacity INTEGER DEFAULT 40,
                teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("- Classes table ready");

        // 2. Subjects Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS subjects (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(50),
                type VARCHAR(50) DEFAULT 'CORE', -- CORE, ELECTIVE
                class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
                teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("- Subjects table ready");

        console.log("Academic Database Setup Completed Successfully!");
    } catch (err) {
        console.error("Error setting up Academic database:", err);
    } finally {
        client.release();
        process.exit();
    }
};

setupAcademic();
