require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function test() {
    try {
        const studentRes = await pool.query("SELECT * FROM students WHERE application_no = 'JPS202610500832'");
        const student = studentRes.rows[0];
        console.log("Student:", student);
        
        if (student) {
            const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [student.user_id]);
            const user = userRes.rows[0];
            console.log("User:", user);
            
            // let's check what default pass they should use
            const dob = student.dob ? new Date(student.dob) : new Date();
            const yyyy = dob.getFullYear();
            const expectedNamePart = user.name.replace(/\s+/g, '').slice(0, 4).toLowerCase();
            const expectedPass = expectedNamePart + yyyy;
            
            console.log("Expected Pass:", expectedPass);
            const isMatch = await bcrypt.compare(expectedPass, user.password_hash);
            console.log("Does the expected pass match the hash in DB?", isMatch);
        } else {
            console.log("Student not found in DB!");
        }
    } catch(e) {
        console.log(e);
    }
    process.exit(0);
}
test();
