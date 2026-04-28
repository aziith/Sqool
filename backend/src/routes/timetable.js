const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET timetable by institution + class
router.get('/', async (req, res) => {
    try {
        const { institution_id, class_id } = req.query;
        let query = `
            SELECT t.*, s.name as subject_name, u.name as teacher_name, c.name as class_name, c.section
            FROM timetables t
            JOIN subjects s ON t.subject_id = s.id
            LEFT JOIN teachers tr ON t.teacher_id = tr.id
            LEFT JOIN users u ON tr.user_id = u.id
            LEFT JOIN classes c ON t.class_id = c.id
            WHERE t.institution_id = $1
        `;
        const params = [institution_id];
        if (class_id) {
            query += ' AND t.class_id = $2';
            params.push(class_id);
        }
        query += ' ORDER BY t.day_of_week, t.start_time';
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add a timetable period
router.post('/', async (req, res) => {
    try {
        const { institution_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room } = req.body;
        const result = await db.query(
            `INSERT INTO timetables (institution_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [institution_id, class_id, subject_id, teacher_id || null, day_of_week, start_time, end_time, room || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a timetable entry
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM timetables WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
