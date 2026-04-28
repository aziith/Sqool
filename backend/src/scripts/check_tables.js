require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
    const stmts = [
        ['add institutions email unique', `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='institutions_email_key') THEN ALTER TABLE institutions ADD CONSTRAINT institutions_email_key UNIQUE (email); END IF; END $$`],
        ['add users email unique', `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='users_email_key') THEN ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email); END IF; END $$`],
        ['create classes', `CREATE TABLE IF NOT EXISTS classes (id SERIAL PRIMARY KEY, institution_id INTEGER, name VARCHAR(50) NOT NULL, section VARCHAR(10), capacity INTEGER DEFAULT 40, academic_year VARCHAR(20) DEFAULT '2025-26', created_at TIMESTAMP DEFAULT NOW())`],
        ['create subjects', `CREATE TABLE IF NOT EXISTS subjects (id SERIAL PRIMARY KEY, institution_id INTEGER, class_id INTEGER, name VARCHAR(100) NOT NULL, code VARCHAR(20), max_marks INTEGER DEFAULT 100, created_at TIMESTAMP DEFAULT NOW())`],
        ['create teachers', `CREATE TABLE IF NOT EXISTS teachers (id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE, employee_id VARCHAR(50), department VARCHAR(100), qualification VARCHAR(200), joining_date DATE, salary NUMERIC(12,2), created_at TIMESTAMP DEFAULT NOW())`],
        ['create students', `CREATE TABLE IF NOT EXISTS students (id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE, class_id INTEGER, enrollment_number VARCHAR(50) UNIQUE, class_name VARCHAR(50), section VARCHAR(10), roll_number INTEGER, date_of_birth DATE, gender VARCHAR(10), parent_name VARCHAR(255), parent_phone VARCHAR(20), address TEXT, admission_date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMP DEFAULT NOW())`],
        ['create attendance', `CREATE TABLE IF NOT EXISTS attendance (id SERIAL PRIMARY KEY, institution_id INTEGER, student_id INTEGER, class_id INTEGER, subject_id INTEGER, date DATE NOT NULL, status VARCHAR(10) DEFAULT 'ABSENT', marked_by INTEGER, remarks TEXT, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(student_id, date, subject_id))`],
        ['create exams', `CREATE TABLE IF NOT EXISTS exams (id SERIAL PRIMARY KEY, institution_id INTEGER, class_id INTEGER, subject_id INTEGER, title VARCHAR(200) NOT NULL, exam_type VARCHAR(50) DEFAULT 'UNIT_TEST', exam_date DATE, max_marks INTEGER DEFAULT 100, pass_marks INTEGER DEFAULT 35, created_at TIMESTAMP DEFAULT NOW())`],
        ['create exam_results', `CREATE TABLE IF NOT EXISTS exam_results (id SERIAL PRIMARY KEY, exam_id INTEGER, student_id INTEGER, marks_obtained NUMERIC(6,2), grade VARCHAR(5), remarks TEXT, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(exam_id, student_id))`],
        ['create homework', `CREATE TABLE IF NOT EXISTS homework (id SERIAL PRIMARY KEY, institution_id INTEGER, class_id INTEGER, subject_id INTEGER, teacher_id INTEGER, title VARCHAR(255) NOT NULL, description TEXT, due_date DATE, created_at TIMESTAMP DEFAULT NOW())`],
        ['create homework_submissions', `CREATE TABLE IF NOT EXISTS homework_submissions (id SERIAL PRIMARY KEY, homework_id INTEGER, student_id INTEGER, submission_text TEXT, file_url TEXT, submitted_at TIMESTAMP DEFAULT NOW(), grade VARCHAR(10), feedback TEXT, UNIQUE(homework_id, student_id))`],
        ['create fee_structures', `CREATE TABLE IF NOT EXISTS fee_structures (id SERIAL PRIMARY KEY, institution_id INTEGER, class_id INTEGER, name VARCHAR(200) NOT NULL, amount NUMERIC(12,2) NOT NULL, frequency VARCHAR(20) DEFAULT 'ANNUAL', academic_year VARCHAR(20) DEFAULT '2025-26', due_date DATE, created_at TIMESTAMP DEFAULT NOW())`],
        ['create fee_payments', `CREATE TABLE IF NOT EXISTS fee_payments (id SERIAL PRIMARY KEY, institution_id INTEGER, student_id INTEGER, fee_structure_id INTEGER, amount_paid NUMERIC(12,2) NOT NULL, payment_date DATE DEFAULT CURRENT_DATE, payment_mode VARCHAR(50) DEFAULT 'CASH', transaction_id VARCHAR(100), status VARCHAR(20) DEFAULT 'PAID', receipt_number VARCHAR(100), remarks TEXT, created_at TIMESTAMP DEFAULT NOW())`],
        ['create books', `CREATE TABLE IF NOT EXISTS books (id SERIAL PRIMARY KEY, institution_id INTEGER, title VARCHAR(255) NOT NULL, author VARCHAR(255), isbn VARCHAR(50), category VARCHAR(100), publisher VARCHAR(200), publish_year INTEGER, total_copies INTEGER DEFAULT 1, available_copies INTEGER DEFAULT 1, rack_location VARCHAR(50), created_at TIMESTAMP DEFAULT NOW())`],
        ['create book_issues', `CREATE TABLE IF NOT EXISTS book_issues (id SERIAL PRIMARY KEY, book_id INTEGER, student_id INTEGER, issued_date DATE DEFAULT CURRENT_DATE, due_date DATE, returned_date DATE, fine_amount NUMERIC(8,2) DEFAULT 0, status VARCHAR(20) DEFAULT 'ISSUED', created_at TIMESTAMP DEFAULT NOW())`],
        ['create leaves', `CREATE TABLE IF NOT EXISTS leaves (id SERIAL PRIMARY KEY, institution_id INTEGER, user_id INTEGER, leave_type VARCHAR(50) DEFAULT 'SICK', from_date DATE NOT NULL, to_date DATE NOT NULL, reason TEXT, status VARCHAR(20) DEFAULT 'PENDING', approved_by INTEGER, created_at TIMESTAMP DEFAULT NOW())`],
        ['create circulars', `CREATE TABLE IF NOT EXISTS circulars (id SERIAL PRIMARY KEY, institution_id INTEGER, title VARCHAR(255) NOT NULL, content TEXT, target_role VARCHAR(20) DEFAULT 'ALL', published_by INTEGER, publish_date DATE DEFAULT CURRENT_DATE, expiry_date DATE, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW())`],
        ['create events', `CREATE TABLE IF NOT EXISTS events (id SERIAL PRIMARY KEY, institution_id INTEGER, title VARCHAR(255) NOT NULL, description TEXT, event_date DATE NOT NULL, venue VARCHAR(255), event_type VARCHAR(50) DEFAULT 'GENERAL', created_by INTEGER, created_at TIMESTAMP DEFAULT NOW())`],
        ['create gallery', `CREATE TABLE IF NOT EXISTS gallery (id SERIAL PRIMARY KEY, institution_id INTEGER, title VARCHAR(255) NOT NULL, image_url TEXT NOT NULL, event_id INTEGER, uploaded_by INTEGER, created_at TIMESTAMP DEFAULT NOW())`],
        ['create transport_routes', `CREATE TABLE IF NOT EXISTS transport_routes (id SERIAL PRIMARY KEY, institution_id INTEGER, route_name VARCHAR(200) NOT NULL, driver_name VARCHAR(200), driver_phone VARCHAR(20), vehicle_number VARCHAR(50), capacity INTEGER, fee_per_month NUMERIC(10,2), created_at TIMESTAMP DEFAULT NOW())`],
        ['create student_transport', `CREATE TABLE IF NOT EXISTS student_transport (id SERIAL PRIMARY KEY, student_id INTEGER UNIQUE, route_id INTEGER, pickup_stop VARCHAR(200), created_at TIMESTAMP DEFAULT NOW())`],
        ['create awards', `CREATE TABLE IF NOT EXISTS awards (id SERIAL PRIMARY KEY, institution_id INTEGER, user_id INTEGER, title VARCHAR(255) NOT NULL, description TEXT, category VARCHAR(100), awarded_date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMP DEFAULT NOW())`],
        ['create notifications', `CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER, title VARCHAR(255) NOT NULL, message TEXT, type VARCHAR(50) DEFAULT 'INFO', is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())`],
    ];

    for (const [label, sql] of stmts) {
        try {
            await pool.query(sql);
            console.log(`✅ ${label}`);
        } catch (e) {
            console.error(`❌ FAILED: ${label}`);
            console.error('   Error:', e.message);
        }
    }
    
    await pool.end();
}

run();
