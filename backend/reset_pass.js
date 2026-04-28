const {Pool}=require('pg');
const bcrypt=require('bcrypt');
require('dotenv').config();
const pool = new Pool({connectionString:process.env.DATABASE_URL});

async function run() {
  const hash = await bcrypt.hash('password123', 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'ajitraj9599@gmail.com']);
  console.log('Password updated successfully for ajitraj9599@gmail.com to password123');
  process.exit(0);
}
run();
