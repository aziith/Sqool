require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrateAdmissionsNewFormat() {
    try {
        console.log("Starting migration: Updating admissions to [Year]-[Class]-[Random] format...");
        
        const res = await pool.query('SELECT id, class_applied, created_at FROM admissions ORDER BY id ASC');
        const admissions = res.rows;
        
        for (const app of admissions) {
            const year = new Date(app.created_at).getFullYear();
            const randomPart = Math.floor(1000 + Math.random() * 9000);
            const newAppNo = `${year}-${app.class_applied}-${randomPart}`;
            
            await pool.query('UPDATE admissions SET application_no = $1 WHERE id = $2', [newAppNo, app.id]);
            console.log(`Updated ID ${app.id} -> ${newAppNo}`);
        }
        
        console.log("Migration complete!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
        process.exit();
    }
}

migrateAdmissionsNewFormat();
