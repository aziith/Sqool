const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:Rexxdb%4012@localhost:5432/attendx"
});

async function run() {
    await client.connect();
    const res = await client.query("UPDATE admissions SET application_no = REPLACE(application_no, 'DIS', 'JPS') WHERE institution_id = 8 AND application_no LIKE 'DIS%'");
    console.log('Updated rows:', res.rowCount);
    await client.end();
}
run();
