const { pool } = require('./src/config/db');

async function addPhoneColumn() {
    try {
        console.log("Adding phone column to users table...");
        await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20);');
        console.log("Successfully added phone column.");
    } catch (e) {
        if (e.code === '42701') {
            console.log("Column phone already exists.");
        } else {
            console.error("Error adding column:", e);
        }
    } finally {
        process.exit();
    }
}

addPhoneColumn();
