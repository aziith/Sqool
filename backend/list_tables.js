require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function listTables() {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log(res.rows.map(r => r.table_name));
}
listTables().then(() => pool.end());
