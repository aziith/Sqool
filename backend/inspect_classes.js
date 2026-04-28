require('dotenv').config();
const { pool } = require('./src/config/db');

const inspectClasses = async () => {
    try {
        const res = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'classes'");
        console.log('COLUMNS_START');
        res.rows.forEach(r => console.log(`${r.column_name} (${r.data_type}, ${r.is_nullable})`));
        console.log('COLUMNS_END');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

inspectClasses();
