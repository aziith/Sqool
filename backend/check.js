const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'rooms';");
    console.log("COLUMNS:");
    res.rows.forEach(r => console.log(r.column_name, r.data_type));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
