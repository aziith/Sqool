const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:Rexxdb%4012@localhost:5432/attendx"
});

async function check() {
    await client.connect();
    const res = await client.query('SELECT * FROM institutions');
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}
check();
