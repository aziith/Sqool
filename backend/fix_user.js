require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function fix() {
    try {
        const appNo = 'JPS202610942734';
        const name = 'Beet Play';
        const dob = '2005-01-01'; // Faked DOB just for login test (beet0101)
        const institution_id = 1;

        const email = 'beetsplay@gmail.com';
        const password_hash = await bcrypt.hash('beet0101', 10);
        
        // CREATE User
        const userResult = await pool.query(
            `INSERT INTO users (institution_id, role, name, email, password_hash, phone)
             VALUES ($1,'STUDENT',$2,$3,$4,$5) RETURNING id`,
            [3, name, email, password_hash, null]
        );
        const user_id = userResult.rows[0].id;

        // CREATE Student
        await pool.query(
            `INSERT INTO students (user_id, enrollment_number, application_no, class_name, section, dob, is_first_login, institution_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [user_id, 'ENR12345', appNo, '10', 'A', dob, true, 3]
        );
        console.log("Fixed!");
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
}
fix();
