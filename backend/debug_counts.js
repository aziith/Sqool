require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    const inst = await pool.query('SELECT id, name FROM institutions');
    console.log('Institutions:', inst.rows);
    for(const i of inst.rows) {
        const clsRes = await pool.query('SELECT count(*) FROM classes WHERE institution_id = $1', [i.id]);
        const subRes = await pool.query('SELECT count(*) FROM subjects WHERE institution_id = $1', [i.id]);
        console.log(`Inst ID: ${i.id} (${i.name}) - Classes: ${clsRes.rows[0].count}, Subjects: ${subRes.rows[0].count}`);
        
        if (clsRes.rows[0].count > 0) {
            const sampleCls = await pool.query('SELECT name, section FROM classes WHERE institution_id = $1 LIMIT 3', [i.id]);
            console.log('Sample classes:', sampleCls.rows);
        }
        if (subRes.rows[0].count > 0) {
            const sampleSub = await pool.query('SELECT name FROM subjects WHERE institution_id = $1 LIMIT 3', [i.id]);
            console.log('Sample subjects:', sampleSub.rows);
        }
    }
}
check().then(() => pool.end());
