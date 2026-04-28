const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Homework ---

// Get homework for a class
router.get('/', async (req, res) => {
    try {
        const { class_id } = req.query;
        const result = await db.query(
            'SELECT h.*, s.name as subject_name FROM homework h JOIN subjects s ON h.subject_id = s.id WHERE h.class_id = $1',
            [class_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create homework
router.post('/', async (req, res) => {
    try {
        const { institution_id, class_id, subject_id, teacher_id, title, description, due_date } = req.body;
        const result = await db.query(
            'INSERT INTO homework (institution_id, class_id, subject_id, teacher_id, title, description, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [institution_id, class_id, subject_id, teacher_id, title, description, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Submissions ---

router.post('/submit', async (req, res) => {
    try {
        const { homework_id, student_id, content, file_url } = req.body;
        const result = await db.query(
            'INSERT INTO homework_submissions (homework_id, student_id, content, file_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [homework_id, student_id, content, file_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/submissions', async (req, res) => {
    try {
        const { homework_id } = req.query;
        const result = await db.query(
            'SELECT hs.*, u.name as student_name FROM homework_submissions hs JOIN users u ON hs.student_id = u.id WHERE hs.homework_id = $1',
            [homework_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
