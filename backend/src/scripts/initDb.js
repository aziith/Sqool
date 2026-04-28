const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, '../models/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema creation script...');
        await pool.query(schema);
        console.log('Database schema created successfully.');

        // Optionally insert a Super Admin if not exists
        const { rows } = await pool.query(`SELECT id FROM users WHERE role = 'SUPER_ADMIN'`);
        if (rows.length === 0) {
            const bcrypt = require('bcrypt');
            const hash = await bcrypt.hash('admin123', 10);
            await pool.query(
                `INSERT INTO users (role, name, email, password_hash) VALUES ($1, $2, $3, $4)`,
                ['SUPER_ADMIN', 'Super Admin', 'admin@attendx.com', hash]
            );
            console.log('Default SUPER_ADMIN created: admin@attendx.com / admin123');
        }
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        pool.end();
    }
};

initDb();
