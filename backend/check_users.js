const {Pool}=require('pg'); 
require('dotenv').config(); 
const pool = new Pool({connectionString:process.env.DATABASE_URL}); 
async function run() {
  const users = await pool.query(`SELECT u.email, u.institution_id, i.id as i_id, u.password_hash 
    FROM users u 
    LEFT JOIN institutions i ON u.institution_id = i.id`);
  console.log(users.rows);
  const bcrypt = require('bcrypt');
  const valid = await bcrypt.compare('password123', users.rows.find(u => u.email === 'ajitraj9599@gmail.com').password_hash);
  console.log('Is password "password123" valid for ajitraj?', valid);
  process.exit(0);
}
run();
