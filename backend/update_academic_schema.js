const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const updateAcademicSchema = async () => {
    const client = await pool.connect();
    try {
        console.log("Updating Academic Schema...");

        // Classes
        await client.query(`ALTER TABLE classes ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 40`);
        await client.query(`ALTER TABLE classes ADD COLUMN IF NOT EXISTS institution_id INTEGER`);
        await client.query(`ALTER TABLE classes ADD COLUMN IF NOT EXISTS teacher_id INTEGER`);
        
        // Subjects
        await client.query(`ALTER TABLE subjects ADD COLUMN IF NOT EXISTS max_marks INTEGER DEFAULT 100`);
        await client.query(`ALTER TABLE subjects ADD COLUMN IF NOT EXISTS institution_id INTEGER`);
        await client.query(`ALTER TABLE subjects ADD COLUMN IF NOT EXISTS class_id INTEGER`);

        console.log("Academic Schema Updated Successfully!");
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        client.release();
        process.exit();
    }
};

updateAcademicSchema();
