require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function seedRaw() {
    try {
        console.log('--- RAW SEEDING START ---');

        // 1. Create Institution
        const instRes = await pool.query(
            `INSERT INTO institutions (name, subdomain, email, phone, address, plan)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (subdomain) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            ['Demo International School', 'demo', 'admin@demo.edu', '1234567890', '123 Education Lane', 'FREE']
        );
        const instId = instRes.rows[0].id;
        console.log('Institution ID:', instId);

        // 2. Create Admin User
        const adminHash = await bcrypt.hash('Admin@123', 10);
        await pool.query(
            `INSERT INTO users (institution_id, role, name, email, password_hash)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            [instId, 'ADMIN', 'System Admin', 'admin@demo.edu', adminHash]
        );
        console.log('Admin User check done.');

        // 3. Create Class
        await pool.query(
            `INSERT INTO classes (institution_id, name, section)
             VALUES ($1, $2, $3)`,
            [instId, 'Grade 10', 'A']
        );
        console.log('Class added.');

        // 4. Create Exam
        await pool.query(
            `INSERT INTO exams (institution_id, name, date)
             VALUES ($1, $2, CURRENT_DATE)`,
            [instId, 'Mid-Term 2025']
        );
        console.log('Exam added.');

        console.log('--- RAW SEEDING COMPLETE ---');
    } catch (err) {
        console.error('Raw seeding failed:', err);
    } finally {
        process.exit();
    }
}

seedRaw();
