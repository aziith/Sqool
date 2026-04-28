const {Pool}=require('pg'); 
require('dotenv').config(); 
const pool = new Pool({connectionString:process.env.DATABASE_URL}); 
async function run() {
  const users = await pool.query(`SELECT * FROM users WHERE email = 'ajitraj9599@gmail.com'`);
  console.log(users.rows);
  process.exit(0);
}
run();
