require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrateAdmissions() {
    try {
        console.log("Starting migration: Updating admissions to sequential numbers...");
        
        // 1. Get all admissions sorted by creation time
        const res = await pool.query('SELECT id FROM admissions ORDER BY id ASC');
        const admissions = res.rows;
        
        console.log(`Found ${admissions.length} admissions to update.`);
        
        // 2. Update each one sequentially
        for (let i = 0; i < admissions.length; i++) {
            const newAppNo = `APP-${i + 1}`;
            const id = admissions[i].id;
            await pool.query('UPDATE admissions SET application_no = $1 WHERE id = $2', [newAppNo, id]);
            console.log(`Updated ID ${id} -> ${newAppNo}`);
        }
        
        console.log("Migration complete!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
        process.exit();
    }
}

migrateAdmissions();
