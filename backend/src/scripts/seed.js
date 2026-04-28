require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
    console.log('\n🌱 Seeding Sqool Database...\n');
    const pass = await bcrypt.hash('password123', 10);

    // Step A: Ensure unique constraints on institutions.email
    console.log('Adding unique constraint to institutions.email...');
    try {
        await pool.query(`ALTER TABLE institutions ADD CONSTRAINT institutions_email_uq UNIQUE (email)`);
        console.log('  Added.');
    } catch(e) { console.log('  Already exists:', e.message.substring(0, 60)); }

    // Step B: Ensure unique constraint on users.email
    console.log('Adding unique constraint to users.email...');
    try {
        await pool.query(`ALTER TABLE users ADD CONSTRAINT users_email_uq UNIQUE (email)`);
        console.log('  Added.');
    } catch(e) { console.log('  Already exists:', e.message.substring(0, 60)); }

    // Step C: Check institutions table columns
    console.log('\nInstitutions columns:');
    const cols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='institutions' ORDER BY ordinal_position`);
    console.log(' ', cols.rows.map(r=>r.column_name).join(', '));

    // Step D: Add email column if missing
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS email VARCHAR(255)`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS name VARCHAR(255)`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS address TEXT`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'FREE'`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`).catch(()=>{});
    await pool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`).catch(()=>{});

    // Step E: Try simple insert
    console.log('\nInserting institution...');
    const instR = await pool.query(`INSERT INTO institutions (name, email, phone, address, plan) VALUES ('Sqool Demo School','admin@sqooldemo.edu','+91-9876543210','123 School Lane, Mumbai','PREMIUM') RETURNING id`).catch(async (e) => {
        console.log('  Insert failed:', e.message);
        // try update
        return pool.query(`SELECT id FROM institutions WHERE email='admin@sqooldemo.edu'`).catch(e2=>{
            throw new Error('Cannot find institution: ' + e2.message);
        });
    });
    const instId = instR.rows[0].id;
    console.log(`  Institution ID: ${instId}`);

    // Step F: Insert users
    console.log('\nInserting users...');
    
    const adminR = await pool.query(`INSERT INTO users (institution_id,role,name,email,password_hash) VALUES ($1,'ADMIN','Admin User','admin@sqooldemo.edu',$2) RETURNING id`, [instId, pass]).catch(async()=>{
        await pool.query(`UPDATE users SET institution_id=$1, password_hash=$2 WHERE email='admin@sqooldemo.edu'`,[instId,pass]);
        return pool.query(`SELECT id FROM users WHERE email='admin@sqooldemo.edu'`);
    });
    const adminId = adminR.rows[0].id;
    console.log('  Admin ID:', adminId);

    const teacherR = await pool.query(`INSERT INTO users (institution_id,role,name,email,password_hash) VALUES ($1,'TEACHER','John Teacher','teacher@test.com',$2) RETURNING id`,[instId,pass]).catch(async()=>{
        await pool.query(`UPDATE users SET institution_id=$1, password_hash=$2 WHERE email='teacher@test.com'`,[instId,pass]);
        return pool.query(`SELECT id FROM users WHERE email='teacher@test.com'`);
    });
    const teacherUserId = teacherR.rows[0].id;
    console.log('  Teacher user ID:', teacherUserId);

    const studentR = await pool.query(`INSERT INTO users (institution_id,role,name,email,password_hash) VALUES ($1,'STUDENT','Sarah Student','student@test.com',$2) RETURNING id`,[instId,pass]).catch(async()=>{
        await pool.query(`UPDATE users SET institution_id=$1, password_hash=$2 WHERE email='student@test.com'`,[instId,pass]);
        return pool.query(`SELECT id FROM users WHERE email='student@test.com'`);
    });
    const studentUserId = studentR.rows[0].id;
    console.log('  Student user ID:', studentUserId);

    // Class
    let classId;
    const cr = await pool.query(`INSERT INTO classes (institution_id,name,section,capacity) VALUES ($1,'Class 10','A',40) RETURNING id`,[instId]).catch(async()=>{
        return pool.query(`SELECT id FROM classes WHERE institution_id=$1 AND name='Class 10' LIMIT 1`,[instId]);
    });
    classId = cr.rows[0].id;
    console.log('\nClass ID:', classId);

    // Subjects
    for (const name of ['Mathematics','Science','English','History','Geography','Computer Science']) {
        await pool.query(`INSERT INTO subjects (institution_id,class_id,name,max_marks) VALUES ($1,$2,$3,100)`,[instId,classId,name]).catch(()=>{});
    }

    // Teacher profile
    await pool.query(`INSERT INTO teachers (user_id,employee_id,department) VALUES ($1,'T101','Mathematics') ON CONFLICT (user_id) DO NOTHING`,[teacherUserId]).catch(()=>{});

    // Student profile - check enrollment_number unique first
    try {
        await pool.query(`ALTER TABLE students ADD CONSTRAINT students_enroll_uq UNIQUE (enrollment_number)`);
    } catch(e) { /* already exists */ }
    
    await pool.query(`INSERT INTO students (user_id,class_id,enrollment_number,class_name,section,roll_number) VALUES ($1,$2,'S500','Class 10','A',15) ON CONFLICT (user_id) DO NOTHING`,[studentUserId,classId]).catch(()=>{});

    // Library
    for (const [t,a,i,c,n] of [
        ['Mathematics Class 10','R.D. Sharma','ISBN-001','Maths',5],
        ['Science & Technology','Lakhmir Singh','ISBN-002','Science',3],
        ['English Grammar','P.C. Wren','ISBN-003','English',4],
        ['Wings of Fire','A.P.J. Kalam','ISBN-004','Biography',2],
    ]) { await pool.query(`INSERT INTO books (institution_id,title,author,isbn,category,total_copies,available_copies) VALUES ($1,$2,$3,$4,$5,$6,$6)`,[instId,t,a,i,c,n]).catch(()=>{}); }

    // Fee + transport + circular + event
    const frR = await pool.query(`INSERT INTO fee_structures (institution_id,class_id,name,amount,frequency) VALUES ($1,$2,'Tuition Fee',12000,'ANNUAL') RETURNING id`,[instId,classId]).catch(async()=>pool.query(`SELECT id FROM fee_structures WHERE institution_id=$1 LIMIT 1`,[instId]));
    await pool.query(`INSERT INTO fee_structures (institution_id,class_id,name,amount,frequency) VALUES ($1,$2,'Transport Fee',18000,'ANNUAL')`,[instId,classId]).catch(()=>{});
    await pool.query(`INSERT INTO transport_routes (institution_id,route_name,driver_name,vehicle_number,capacity,fee_per_month) VALUES ($1,'Route 1','Ramu Driver','MH-01-1234',40,1500)`,[instId]).catch(()=>{});
    await pool.query(`INSERT INTO circulars (institution_id,title,content,target_role,published_by) VALUES ($1,'Welcome!','Portal is ready.','ALL',$2)`,[instId,adminId]).catch(()=>{});
    await pool.query(`INSERT INTO events (institution_id,title,description,event_date,created_by) VALUES ($1,'Sports Day','Annual event.',CURRENT_DATE+30,$2)`,[instId,adminId]).catch(()=>{});

    console.log('\n══════════════════════════════════');
    console.log('✅  SQOOL SEED COMPLETE!\n');
    console.log('    admin@sqooldemo.edu  → ADMIN    | password123');
    console.log('    teacher@test.com     → TEACHER  | password123');
    console.log('    student@test.com     → STUDENT  | password123');
    console.log('\n🌐  http://localhost:5174/login\n');
    process.exit(0);
}

seed().catch(e => {
    console.error('\n❌ Seed failed:', e.message);
    console.error(e.stack);
    process.exit(1);
});
