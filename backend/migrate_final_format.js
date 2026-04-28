require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrateFinalFormat() {
    try {
        console.log("Starting final migration: Updating admissions to [Prefix][Year][Class][Random6]...");
        
        // 1. Get all admissions with their institution and class info
        const res = await pool.query(`
            SELECT a.id, a.class_applied, a.created_at, i.name as school_name 
            FROM admissions a
            JOIN institutions i ON a.institution_id = i.id
            ORDER BY a.id ASC
        `);
        const admissions = res.rows;
        
        for (const app of admissions) {
            const prefix = app.school_name.split(' ').map(word => word[0].toUpperCase()).join('');
            const year = new Date(app.created_at).getFullYear();
            const randomPart = Math.floor(100000 + Math.random() * 900000);
            
            // Clean up class_applied (remove Grade/Class text if present)
            const classNum = app.class_applied.replace(/[^0-9]/g, '');
            
            const newAppNo = `${prefix}${year}${classNum}${randomPart}`;
            
            await pool.query('UPDATE admissions SET application_no = $1 WHERE id = $2', [newAppNo, app.id]);
            console.log(`Updated ID ${app.id} -> ${newAppNo} (${app.school_name})`);
        }
        
        console.log("Migration complete!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
        process.exit();
    }
}

migrateFinalFormat();
