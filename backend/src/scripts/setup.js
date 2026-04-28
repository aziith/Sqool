/**
 * SQOOL - Fix Constraints & Run Full Setup
 * Adds missing UNIQUE constraints to existing tables, then runs the full schema + seed.
 */
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const exec = (q, params) => pool.query(q, params);

async function run() {
    console.log('\n🚀 SQOOL Database Setup Starting...\n');

    // ─── STEP 1: Drop & recreate cleanly with all proper tables ─────
    console.log('🔧 Step 1: Fixing table structure...');

    // Add unique constraints to existing tables if missing
    await exec(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS email VARCHAR(255)`).catch(() => {});
    await exec(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='institutions_email_key') THEN ALTER TABLE institutions ADD CONSTRAINT institutions_email_key UNIQUE (email); END IF; END $$`).catch(() => {});
    await exec(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='users_email_key') THEN ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email); END IF; END $$`).catch(() => {});

    console.log('   ✅ Constraints fixed.\n');

    // ─── STEP 2: Create all NEW tables (IF NOT EXISTS) ───────────────
    console.log('📦 Step 2: Creating missing tables...');

    await exec(`CREATE TABLE IF NOT EXISTS institutions (
        id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, phone VARCHAR(20),
        address TEXT, logo_url TEXT, plan VARCHAR(50) DEFAULT 'FREE',
        is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL, name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, password_hash TEXT NOT NULL,
        phone VARCHAR(20), avatar_url TEXT, is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL, section VARCHAR(10), capacity INTEGER DEFAULT 40,
        academic_year VARCHAR(20) DEFAULT '2025-26', created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL, code VARCHAR(20), max_marks INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        employee_id VARCHAR(50), department VARCHAR(100), qualification VARCHAR(200),
        joining_date DATE, salary NUMERIC(12,2), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id), enrollment_number VARCHAR(50) UNIQUE,
        class_name VARCHAR(50), section VARCHAR(10), roll_number INTEGER,
        date_of_birth DATE, gender VARCHAR(10), parent_name VARCHAR(255),
        parent_phone VARCHAR(20), address TEXT, admission_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS timetables (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        subject_id INTEGER REFERENCES subjects(id), teacher_id INTEGER REFERENCES teachers(id),
        day_of_week VARCHAR(10) NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL,
        room VARCHAR(50), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id), subject_id INTEGER REFERENCES subjects(id),
        date DATE NOT NULL, status VARCHAR(10) DEFAULT 'ABSENT',
        marked_by INTEGER REFERENCES users(id), remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW(), UNIQUE(student_id, date, subject_id)
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id), subject_id INTEGER REFERENCES subjects(id),
        title VARCHAR(200) NOT NULL, exam_type VARCHAR(50) DEFAULT 'UNIT_TEST',
        exam_date DATE, max_marks INTEGER DEFAULT 100, pass_marks INTEGER DEFAULT 35,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS exam_results (
        id SERIAL PRIMARY KEY, exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        marks_obtained NUMERIC(6,2), grade VARCHAR(5), remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW(), UNIQUE(exam_id, student_id)
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS homework (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id), subject_id INTEGER REFERENCES subjects(id),
        teacher_id INTEGER REFERENCES teachers(id), title VARCHAR(255) NOT NULL,
        description TEXT, due_date DATE, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS homework_submissions (
        id SERIAL PRIMARY KEY, homework_id INTEGER REFERENCES homework(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        submission_text TEXT, file_url TEXT, submitted_at TIMESTAMP DEFAULT NOW(),
        grade VARCHAR(10), feedback TEXT, UNIQUE(homework_id, student_id)
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS fee_structures (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id), name VARCHAR(200) NOT NULL,
        amount NUMERIC(12,2) NOT NULL, frequency VARCHAR(20) DEFAULT 'ANNUAL',
        academic_year VARCHAR(20) DEFAULT '2025-26', due_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS fee_payments (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        fee_structure_id INTEGER REFERENCES fee_structures(id),
        amount_paid NUMERIC(12,2) NOT NULL, payment_date DATE DEFAULT CURRENT_DATE,
        payment_mode VARCHAR(50) DEFAULT 'CASH', transaction_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'PAID', receipt_number VARCHAR(100),
        remarks TEXT, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, author VARCHAR(255), isbn VARCHAR(50),
        category VARCHAR(100), publisher VARCHAR(200), publish_year INTEGER,
        total_copies INTEGER DEFAULT 1, available_copies INTEGER DEFAULT 1,
        rack_location VARCHAR(50), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS book_issues (
        id SERIAL PRIMARY KEY, book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        issued_date DATE DEFAULT CURRENT_DATE, due_date DATE, returned_date DATE,
        fine_amount NUMERIC(8,2) DEFAULT 0, status VARCHAR(20) DEFAULT 'ISSUED',
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        leave_type VARCHAR(50) DEFAULT 'SICK', from_date DATE NOT NULL, to_date DATE NOT NULL,
        reason TEXT, status VARCHAR(20) DEFAULT 'PENDING',
        approved_by INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS circulars (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, content TEXT, target_role VARCHAR(20) DEFAULT 'ALL',
        published_by INTEGER REFERENCES users(id), publish_date DATE DEFAULT CURRENT_DATE,
        expiry_date DATE, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, description TEXT, event_date DATE NOT NULL,
        venue VARCHAR(255), event_type VARCHAR(50) DEFAULT 'GENERAL',
        created_by INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, image_url TEXT NOT NULL,
        event_id INTEGER REFERENCES events(id), uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS transport_routes (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        route_name VARCHAR(200) NOT NULL, driver_name VARCHAR(200), driver_phone VARCHAR(20),
        vehicle_number VARCHAR(50), capacity INTEGER, fee_per_month NUMERIC(10,2),
        created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS student_transport (
        id SERIAL PRIMARY KEY, student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
        route_id INTEGER REFERENCES transport_routes(id),
        pickup_stop VARCHAR(200), created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS awards (
        id SERIAL PRIMARY KEY, institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, description TEXT, category VARCHAR(100),
        awarded_date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMP DEFAULT NOW()
    )`);

    await exec(`CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL, message TEXT, type VARCHAR(50) DEFAULT 'INFO',
        is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW()
    )`);

    // Indexes
    await exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).catch(() => {});
    await exec(`CREATE INDEX IF NOT EXISTS idx_users_institution ON users(institution_id)`).catch(() => {});
    await exec(`CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id)`).catch(() => {});
    await exec(`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)`).catch(() => {});
    await exec(`CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id)`).catch(() => {});
    await exec(`CREATE INDEX IF NOT EXISTS idx_fee_payments_student ON fee_payments(student_id)`).catch(() => {});

    console.log('   ✅ All tables ready.\n');

    // ─── STEP 3: Seed Institution ────────────────────────────────────
    console.log('🏫 Step 3: Seeding institution...');
    const instR = await exec(`
        INSERT INTO institutions (name, email, phone, address, plan)
        VALUES ('Sqool Demo School', 'admin@sqooldemo.edu', '+91-9876543210', '123 School Lane, Mumbai', 'PREMIUM')
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id
    `);
    const instId = instR.rows[0].id;
    console.log(`   ✅ Institution ID: ${instId}\n`);

    // ─── STEP 4: Seed Users ──────────────────────────────────────────
    console.log('👤 Step 4: Seeding users...');
    const pass = await bcrypt.hash('password123', 10);

    const adminR = await exec(`
        INSERT INTO users (institution_id, role, name, email, password_hash)
        VALUES ($1,'ADMIN','Admin User','admin@sqooldemo.edu',$2)
        ON CONFLICT (email) DO UPDATE SET institution_id=$1, password_hash=$2 RETURNING id
    `, [instId, pass]);
    const adminId = adminR.rows[0].id;

    const teacherR = await exec(`
        INSERT INTO users (institution_id, role, name, email, password_hash)
        VALUES ($1,'TEACHER','John Teacher','teacher@test.com',$2)
        ON CONFLICT (email) DO UPDATE SET institution_id=$1, password_hash=$2 RETURNING id
    `, [instId, pass]);
    const teacherUserId = teacherR.rows[0].id;

    const studentR = await exec(`
        INSERT INTO users (institution_id, role, name, email, password_hash)
        VALUES ($1,'STUDENT','Sarah Student','student@test.com',$2)
        ON CONFLICT (email) DO UPDATE SET institution_id=$1, password_hash=$2 RETURNING id
    `, [instId, pass]);
    const studentUserId = studentR.rows[0].id;
    console.log('   ✅ Users seeded.\n');

    // ─── STEP 5: Class + Subjects ────────────────────────────────────
    console.log('📚 Step 5: Seeding classes & subjects...');
    let classId;
    try {
        const cr = await exec(`INSERT INTO classes (institution_id, name, section) VALUES ($1,'Class 10','A') RETURNING id`, [instId]);
        classId = cr.rows[0].id;
    } catch {
        const cr = await exec(`SELECT id FROM classes WHERE institution_id=$1 AND name='Class 10' AND section='A' LIMIT 1`, [instId]);
        classId = cr.rows[0]?.id;
    }

    for (const name of ['Mathematics','Science','English','History','Geography','Computer Science']) {
        await exec(`INSERT INTO subjects (institution_id, class_id, name) VALUES ($1,$2,$3)`, [instId, classId, name]).catch(() => {});
    }
    console.log(`   ✅ Class ID: ${classId}, subjects seeded.\n`);

    // ─── STEP 6: Teacher & Student Profiles ─────────────────────────
    console.log('🧑‍🏫 Step 6: Creating profiles...');
    await exec(`INSERT INTO teachers (user_id, employee_id, department, joining_date) VALUES ($1,'T101','Mathematics','2020-06-01') ON CONFLICT (user_id) DO NOTHING`, [teacherUserId]);
    await exec(`INSERT INTO students (user_id, class_id, enrollment_number, class_name, section, roll_number, gender) VALUES ($1,$2,'S500','Class 10','A',15,'Female') ON CONFLICT (user_id) DO NOTHING`, [studentUserId, classId]);
    console.log('   ✅ Profiles created.\n');

    // ─── STEP 7: Library ─────────────────────────────────────────────
    console.log('📖 Step 7: Seeding library...');
    for (const [title, author, isbn, cat, copies] of [
        ['Mathematics for Class 10','R.D. Sharma','ISBN-001','Mathematics',5],
        ['Science & Technology','Lakhmir Singh','ISBN-002','Science',3],
        ['English Grammar','P.C. Wren','ISBN-003','English',4],
        ['Wings of Fire','A.P.J. Abdul Kalam','ISBN-004','Biography',2],
        ['Computer Fundamentals','Pradeep Sinha','ISBN-005','Computer',3],
    ]) {
        await exec(`INSERT INTO books (institution_id,title,author,isbn,category,total_copies,available_copies) VALUES ($1,$2,$3,$4,$5,$6,$6)`, [instId,title,author,isbn,cat,copies]).catch(() => {});
    }
    console.log('   ✅ Library seeded.\n');

    // ─── STEP 8: Transport + Fee + Circular + Event ──────────────────
    console.log('🚌 Step 8: Seeding other data...');
    await exec(`INSERT INTO transport_routes (institution_id,route_name,driver_name,vehicle_number,capacity,fee_per_month) VALUES ($1,'Route 1 - Andheri','Ramu Driver','MH-01-1234',40,1500)`, [instId]).catch(() => {});
    await exec(`INSERT INTO fee_structures (institution_id,class_id,name,amount,frequency) VALUES ($1,$2,'Tuition Fee',12000,'ANNUAL')`, [instId,classId]).catch(() => {});
    await exec(`INSERT INTO fee_structures (institution_id,class_id,name,amount,frequency) VALUES ($1,$2,'Transport Fee',18000,'ANNUAL')`, [instId,classId]).catch(() => {});
    await exec(`INSERT INTO circulars (institution_id,title,content,target_role,published_by) VALUES ($1,'Welcome to Sqool!','Your campus portal is ready to use.','ALL',$2)`, [instId,adminId]).catch(() => {});
    await exec(`INSERT INTO events (institution_id,title,description,event_date,venue,created_by) VALUES ($1,'Annual Sports Day','Annual sports competition.',CURRENT_DATE+30,'School Ground',$2)`, [instId,adminId]).catch(() => {});
    console.log('   ✅ Done.\n');

    // ─── SUMMARY ─────────────────────────────────────────────────────
    console.log('══════════════════════════════════════════');
    console.log('✅  SQOOL DATABASE SETUP COMPLETE!\n');
    console.log('📋  Test Accounts  |  Password: password123');
    console.log('    👑  admin@sqooldemo.edu   (ADMIN)');
    console.log('    🧑‍🏫  teacher@test.com       (TEACHER)');
    console.log('    🎓  student@test.com       (STUDENT)\n');
    console.log('🌐  http://localhost:5174/login\n');

    process.exit(0);
}

run().catch(e => {
    console.error('\n❌ Setup failed:', e.message);
    console.error(e);
    process.exit(1);
});
