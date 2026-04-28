require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    const tables = ['institutions','users','students','teachers','classes'];
    for (const t of tables) {
        const r = await p.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`, [t]);
        console.log(`\n${t}: ${r.rows.map(x=>x.column_name).join(', ')}`);
    }
    
    // Show current data
    const i = await p.query(`SELECT id, name, email FROM institutions LIMIT 5`).catch(()=>({rows:[]}));
    console.log('\nInstitutions data:', i.rows);
    
    const u = await p.query(`SELECT id, role, name, email, institution_id FROM users LIMIT 5`).catch(()=>({rows:[]}));
    console.log('\nUsers data:', u.rows);
    
    await p.end();
}
check().catch(e => { console.error(e.message); process.exit(1); });
