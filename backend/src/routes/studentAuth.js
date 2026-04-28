const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const { pool } = require('../config/db');

const router = express.Router();

// Student Login
router.post('/login', async (req, res) => {
    try {
        const { applicationNo, password } = req.body;
        console.log(`[Student Login] Attemping login for ${applicationNo}`);

        if (!applicationNo || !password) {
            return res.status(400).json({ message: "applicationNo and password are required" });
        }

        const { rows } = await pool.query(`
            SELECT s.*, u.password_hash, u.name, u.role
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.application_no = $1 OR s.enrollment_number = $1
        `, [applicationNo]);

        if (rows.length === 0) {
            console.log(`[Student Login] User ${applicationNo} not found in DB`);
            return res.status(404).json({ message: "Student not found" });
        }

        const student = rows[0];

        const isMatch = await bcrypt.compare(password, student.password_hash);

        if (!isMatch) {
            console.log(`[Student Login] Invalid password for ${applicationNo}`);
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate token
        const payload = {
            id: student.user_id,
            role: 'STUDENT',
            institution_id: student.institution_id
        };
        const token = jwt.encode(payload, process.env.JWT_SECRET || 'secret');

        return res.json({
            message: "Login success",
            isFirstLogin: student.is_first_login,
            studentId: student.user_id,
            token,
            user: {
                id: student.user_id,
                name: student.name,
                role: 'STUDENT',
                applicationNo: student.application_no || student.enrollment_number
            }
        });
    } catch (err) {
        console.error('[Student Login Error]', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    try {
        const { studentId, newPassword } = req.body;

        if (!studentId || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Invalid input. Password must be at least 6 characters." });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        // Update password in users table
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, studentId]);

        // Update is_first_login in students table
        await pool.query('UPDATE students SET is_first_login = false WHERE user_id = $1', [studentId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error('[Student Change Password Error]', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
