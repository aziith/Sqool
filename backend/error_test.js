require('dotenv').config();
const db = require('./src/config/db');

const test = async () => {
    try {
        await db.query(`
            INSERT INTO classes (institution_id, name, section, capacity, teacher_id)
            VALUES ($1, $2, $3, $4, $5)
        `, [1, 'Grade 10', 'A', 40, null]);
        console.log("SUCCESS");
    } catch (err) {
        console.log("ERROR_MESSAGE_START");
        console.log(err.message);
        console.log("ERROR_MESSAGE_END");
    } finally {
        process.exit();
    }
};

test();
