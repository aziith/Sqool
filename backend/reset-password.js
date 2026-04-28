const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function resetPassword() {
  try {
    const email = 'ajitraj9599@gmail.com';
    const newPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await client.connect();
    
    const res = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
      [passwordHash, email]
    );

    if (res.rows.length > 0) {
      console.log(`Successfully reset password for ${email} to "${newPassword}"`);
    } else {
      console.log(`User ${email} not found.`);
    }

    await client.end();
  } catch (err) {
    console.error('Error resetting password:', err.message);
    process.exit(1);
  }
}

resetPassword();
