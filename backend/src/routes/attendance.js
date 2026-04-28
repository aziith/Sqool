const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// Mark attendance (Teacher)
router.post('/', async (req, res) => {
    // Assume auth middleware adds req.user
    const { institution_id, id: marked_by } = req.user || { institution_id: 1, id: 1 }; // Mock
    const { date, records } = req.body;
    // records: [{ student_id, status }]

    try {
        await pool.query('BEGIN');
        for (const record of records) {
            await pool.query(
                `INSERT INTO attendance (institution_id, student_id, date, status, marked_by) 
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (student_id, date) 
                 DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by`,
                [institution_id, record.student_id, date, record.status, marked_by]
            );
        }
        await pool.query('COMMIT');
        res.json({ message: 'Attendance marked successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get attendance for a class/date
router.get('/', async (req, res) => {
    try {
        const { date, class_name } = req.query;
        // Basic join to fetch students in a class and their attendance
        const { rows } = await pool.query(`
            SELECT s.user_id, u.name, s.enrollment_number, a.status 
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN attendance a ON a.student_id = s.user_id AND a.date = $1
            WHERE s.class_name = $2
        `, [date, class_name]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
