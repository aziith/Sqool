require('dotenv').config();
const { pool } = require('./src/config/db');

const diagnose = async () => {
    try {
        console.log('Using DB URL:', process.env.DATABASE_URL ? 'Defined' : 'UNDEFINED');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', tables.rows.map(r => r.table_name).join(', '));

        if (tables.rows.find(r => r.table_name === 'classes')) {
            const columns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'classes'");
            console.log('Columns in classes:', JSON.stringify(columns.rows, null, 2));
            
            const count = await pool.query("SELECT COUNT(*) FROM classes");
            console.log('Rows in classes:', count.rows[0].count);

            const sample = await pool.query("SELECT * FROM classes LIMIT 5");
            console.log('Sample data:', JSON.stringify(sample.rows, null, 2));
        } else {
            console.log('CRITICAL: classes table NOT FOUND!');
        }
    } catch (err) {
        console.error('Diagnosis failed:', err);
    } finally {
        process.exit();
    }
};

diagnose();
