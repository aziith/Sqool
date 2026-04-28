const { pool } = require('./src/config/db');

const migration = async () => {
  try {
    const sql = `
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
    `;
    console.log('Running migration: creating admissions table...');
    await pool.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
};

migration();
