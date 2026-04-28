const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:Rexxdb%4012@localhost:5432/attendx"
});

async function run() {
    await client.connect();
    // 1. Move admissions from inst 1 to inst 8
    // 2. Replace DIS with JPS in application_no
    const res = await client.query(`
        UPDATE admissions 
        SET institution_id = 8, 
            application_no = REPLACE(application_no, 'DIS', 'JPS') 
        WHERE institution_id = 1 AND application_no LIKE 'DIS%'
    `);
    console.log('Migrated and Updated rows:', res.rowCount);
    await client.end();
}
run();
