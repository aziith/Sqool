const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

const seedUsers = async () => {
    try {
        const passwordHash = await bcrypt.hash('password123', 10);
        
        // 1. Create a Teacher
        // Assuming institution id 1 exists from previous registration
        const teacherResult = await pool.query(
            "INSERT INTO users (institution_id, role, name, email, password_hash) VALUES (1, 'TEACHER', 'John Teacher', 'teacher@test.com', $1) RETURNING id",
            [passwordHash]
        );
        await pool.query(
            "INSERT INTO teachers (user_id, employee_id, department) VALUES ($1, 'T101', 'Mathematics')",
            [teacherResult.rows[0].id]
        );

        // 2. Create a Student
        const studentResult = await pool.query(
            "INSERT INTO users (institution_id, role, name, email, password_hash) VALUES (1, 'STUDENT', 'Sarah Student', 'student@test.com', $1) RETURNING id",
            [passwordHash]
        );
        await pool.query(
            "INSERT INTO students (user_id, enrollment_number, class_name, section) VALUES ($1, 'S500', 'Class 10', 'A')",
            [studentResult.rows[0].id]
        );

        console.log('Test users created successfully: teacher@test.com, student@test.com (pass: password123)');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedUsers();
