const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Classes ---

// Get all classes for an institution
router.get('/classes', async (req, res) => {
    try {
        const { institution_id } = req.query; // Assuming this is passed for now, will use middleware later
        const result = await db.query(
            'SELECT c.*, u.name as teacher_name FROM classes c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.institution_id = $1',
            [institution_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new class
router.post('/classes', async (req, res) => {
    try {
        const { institution_id, name, section, teacher_id, capacity } = req.body;
        const result = await db.query(
            'INSERT INTO classes (institution_id, name, section, teacher_id, capacity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, name, section, parseInt(teacher_id) || null, parseInt(capacity) || 40]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a class
router.put('/classes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, section, teacher_id, capacity } = req.body;
        const result = await db.query(
            'UPDATE classes SET name = $1, section = $2, teacher_id = $3, capacity = $4 WHERE id = $5 RETURNING *',
            [name, section, parseInt(teacher_id) || null, parseInt(capacity) || 40, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Class not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a class
router.delete('/classes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM classes WHERE id = $1', [id]);
        res.json({ message: 'Class deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Subjects ---

// Get all subjects
router.get('/subjects', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query('SELECT * FROM subjects WHERE institution_id = $1', [institution_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a subject
router.post('/subjects', async (req, res) => {
    try {
        const { institution_id, name, code, class_id, max_marks } = req.body;
        const result = await db.query(
            'INSERT INTO subjects (institution_id, name, code, class_id, max_marks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, name, code, class_id, max_marks || 100]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a subject
router.put('/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, class_id, max_marks } = req.body;
        const result = await db.query(
            'UPDATE subjects SET name = $1, code = $2, class_id = $3, max_marks = $4 WHERE id = $5 RETURNING *',
            [name, code, class_id, max_marks, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Subject not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a subject
router.delete('/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM subjects WHERE id = $1', [id]);
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Timetable ---

router.get('/timetable', async (req, res) => {
    try {
        const { class_id } = req.query;
        const result = await db.query(
            `SELECT t.*, s.name as subject_name, u.name as teacher_name 
             FROM timetables t 
             JOIN subjects s ON t.subject_id = s.id 
             JOIN users u ON t.teacher_id = u.id 
             WHERE t.class_id = $1 ORDER BY t.day_of_week`,
            [class_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/timetable', async (req, res) => {
    try {
        const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number } = req.body;
        const result = await db.query(
            'INSERT INTO timetables (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
