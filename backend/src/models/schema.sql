-- ============================================================
-- SQOOL - School Management SaaS
-- Complete Database Schema
-- ============================================================

-- ============================================================
-- CORE: Multi-tenant Institutions & Users
-- ============================================================

CREATE TABLE IF NOT EXISTS institutions (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    address         TEXT,
    logo_url        TEXT,
    plan            VARCHAR(50) DEFAULT 'FREE',  -- FREE, BASIC, PREMIUM
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ADMISSIONS: Student Applications (before enrollment)
-- ============================================================

CREATE TABLE IF NOT EXISTS admissions (
    id                   SERIAL PRIMARY KEY,
    institution_id       INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    applicant_name       VARCHAR(255) NOT NULL,
    gender               VARCHAR(10),
    applied_date         DATE DEFAULT CURRENT_DATE,
    class_applied        VARCHAR(50),
    parent_name          VARCHAR(255),
    parent_phone         VARCHAR(20),
    email                VARCHAR(255),
    address              TEXT,
    status               VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','INTERVIEW','SELECTED','REJECTED','ON_HOLD')),
    application_no       VARCHAR(50) UNIQUE,
    registration_fee_paid BOOLEAN DEFAULT FALSE,
    remarks              TEXT,
    created_at           TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN','ADMIN','TEACHER','STUDENT','PARENT')),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    phone           VARCHAR(20),
    avatar_url      TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ACADEMICS: Classes, Sections, Subjects, Timetables
-- ============================================================

CREATE TABLE IF NOT EXISTS classes (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,       -- e.g. "Class 10"
    section         VARCHAR(10),                -- e.g. "A", "B"
    capacity        INTEGER DEFAULT 40,
    academic_year   VARCHAR(20) DEFAULT '2025-26',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20),
    max_marks       INTEGER DEFAULT 100,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teachers (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id     VARCHAR(50) UNIQUE,
    department      VARCHAR(100),
    qualification   VARCHAR(200),
    joining_date    DATE,
    salary          NUMERIC(12,2),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id),
    enrollment_number VARCHAR(50) UNIQUE,
    class_name      VARCHAR(50),
    section         VARCHAR(10),
    roll_number     INTEGER,
    date_of_birth   DATE,
    gender          VARCHAR(10),
    parent_name     VARCHAR(255),
    parent_phone    VARCHAR(20),
    address         TEXT,
    admission_date  DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetables (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    subject_id      INTEGER REFERENCES subjects(id),
    teacher_id      INTEGER REFERENCES teachers(id),
    day_of_week     VARCHAR(10) NOT NULL,       -- Monday, Tuesday...
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    room            VARCHAR(50),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id),
    subject_id      INTEGER REFERENCES subjects(id),
    date            DATE NOT NULL,
    status          VARCHAR(10) DEFAULT 'ABSENT' CHECK (status IN ('PRESENT','ABSENT','LATE','EXCUSED')),
    marked_by       INTEGER REFERENCES users(id),
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, date, subject_id)
);

-- ============================================================
-- EXAMS & RESULTS
-- ============================================================

CREATE TABLE IF NOT EXISTS exams (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id),
    subject_id      INTEGER REFERENCES subjects(id),
    title           VARCHAR(200) NOT NULL,
    exam_type       VARCHAR(50) DEFAULT 'UNIT_TEST',  -- UNIT_TEST, MIDTERM, FINAL
    exam_date       DATE,
    max_marks       INTEGER DEFAULT 100,
    pass_marks      INTEGER DEFAULT 35,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_results (
    id              SERIAL PRIMARY KEY,
    exam_id         INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained  NUMERIC(6,2),
    grade           VARCHAR(5),
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- ============================================================
-- HOMEWORK & ASSIGNMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS homework (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id),
    subject_id      INTEGER REFERENCES subjects(id),
    teacher_id      INTEGER REFERENCES teachers(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    due_date        DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homework_submissions (
    id              SERIAL PRIMARY KEY,
    homework_id     INTEGER REFERENCES homework(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url        TEXT,
    submitted_at    TIMESTAMP DEFAULT NOW(),
    grade           VARCHAR(10),
    feedback        TEXT,
    UNIQUE(homework_id, student_id)
);

-- ============================================================
-- FEES & ACCOUNTS
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_structures (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    class_id        INTEGER REFERENCES classes(id),
    name            VARCHAR(200) NOT NULL,      -- Tuition Fee, Transport Fee...
    amount          NUMERIC(12,2) NOT NULL,
    frequency       VARCHAR(20) DEFAULT 'ANNUAL', -- MONTHLY, QUARTERLY, ANNUAL
    academic_year   VARCHAR(20) DEFAULT '2025-26',
    due_date        DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_payments (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id INTEGER REFERENCES fee_structures(id),
    amount_paid     NUMERIC(12,2) NOT NULL,
    payment_date    DATE DEFAULT CURRENT_DATE,
    payment_mode    VARCHAR(50) DEFAULT 'CASH',  -- CASH, ONLINE, CHEQUE, UPI
    transaction_id  VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'PAID' CHECK (status IN ('PAID','PENDING','OVERDUE','PARTIAL')),
    receipt_number  VARCHAR(100),
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- LIBRARY
-- ============================================================

CREATE TABLE IF NOT EXISTS books (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255),
    isbn            VARCHAR(50),
    category        VARCHAR(100),
    publisher       VARCHAR(200),
    publish_year    INTEGER,
    total_copies    INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    rack_location   VARCHAR(50),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS book_issues (
    id              SERIAL PRIMARY KEY,
    book_id         INTEGER REFERENCES books(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    issued_date     DATE DEFAULT CURRENT_DATE,
    due_date        DATE,
    returned_date   DATE,
    fine_amount     NUMERIC(8,2) DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'ISSUED' CHECK (status IN ('ISSUED','RETURNED','OVERDUE')),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- LEAVES
-- ============================================================

CREATE TABLE IF NOT EXISTS leaves (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    leave_type      VARCHAR(50) DEFAULT 'SICK',  -- SICK, CASUAL, EARNED
    from_date       DATE NOT NULL,
    to_date         DATE NOT NULL,
    reason          TEXT,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    approved_by     INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- COMMUNICATION: Circulars, Events, Announcements
-- ============================================================

CREATE TABLE IF NOT EXISTS circulars (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    target_role     VARCHAR(20) DEFAULT 'ALL',  -- ALL, TEACHER, STUDENT, PARENT
    published_by    INTEGER REFERENCES users(id),
    publish_date    DATE DEFAULT CURRENT_DATE,
    expiry_date     DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    event_date      DATE NOT NULL,
    venue           VARCHAR(255),
    event_type      VARCHAR(50) DEFAULT 'GENERAL',
    created_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    image_url       TEXT NOT NULL,
    event_id        INTEGER REFERENCES events(id),
    uploaded_by     INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TRANSPORT
-- ============================================================

CREATE TABLE IF NOT EXISTS transport_routes (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    route_name      VARCHAR(200) NOT NULL,
    driver_name     VARCHAR(200),
    driver_phone    VARCHAR(20),
    vehicle_number  VARCHAR(50),
    capacity        INTEGER,
    fee_per_month   NUMERIC(10,2),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_transport (
    id              SERIAL PRIMARY KEY,
    student_id      INTEGER REFERENCES students(id) ON DELETE CASCADE,
    route_id        INTEGER REFERENCES transport_routes(id),
    pickup_stop     VARCHAR(200),
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id)
);

-- ============================================================
-- AWARDS & ACHIEVEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS awards (
    id              SERIAL PRIMARY KEY,
    institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),               -- Academic, Sports, Cultural
    awarded_date    DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    message         TEXT,
    type            VARCHAR(50) DEFAULT 'INFO',  -- INFO, WARNING, SUCCESS
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_institution ON users(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_book_issues_student ON book_issues(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_class ON homework(class_id);
CREATE INDEX IF NOT EXISTS idx_circulars_institution ON circulars(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_institution ON events(institution_id);

-- ============================================================
-- DONE
-- ============================================================
