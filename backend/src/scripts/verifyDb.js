const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    try {
        const { rows: columns } = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'institutions'
        `);
        console.log('Columns in institutions table:', columns.map(c => c.column_name));

        const { rows: insts } = await pool.query('SELECT * FROM institutions LIMIT 1');
        console.log('Sample Institution:', insts[0]);

        const { rows: users } = await pool.query('SELECT name, email, role FROM users');
        console.log('All Users:', users);

    } catch (err) {
        console.error('Verification failed:', err.message);
    } finally {
        await pool.end();
    }
}

main();
