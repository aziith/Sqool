require('dotenv').config();
const { pool } = require('./src/config/db');
const fs = require('fs');

async function dumpSchemas() {
    try {
        const u = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
        const i = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'institutions'");
        
        let output = "USERS SCHEMA:\n";
        u.rows.forEach(r => output += `${r.column_name}: ${r.data_type}\n`);
        output += "\nINSTITUTIONS SCHEMA:\n";
        i.rows.forEach(r => output += `${r.column_name}: ${r.data_type}\n`);
        
        fs.writeFileSync('schemas_profile.txt', output);
        console.log("Schemas dumped to schemas_profile.txt");
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
        process.exit();
    }
}

dumpSchemas();
