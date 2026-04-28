const {Pool}=require('pg'); 
require('dotenv').config(); 
const pool = new Pool({connectionString:process.env.DATABASE_URL}); 
async function run() {
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
run();
