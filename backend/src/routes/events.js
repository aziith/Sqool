const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireRole } = require('../middleware/auth');

// GET all events
router.get('/', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query(
            'SELECT * FROM events WHERE institution_id = $1 ORDER BY event_date DESC',
            [institution_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create event
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res) => {
    try {
        const { institution_id, title, description, event_date, venue, event_type, created_by } = req.body;
        const result = await db.query(
            `INSERT INTO events (institution_id, title, description, event_date, venue, event_type, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [institution_id, title, description, event_date, venue || null, event_type || 'GENERAL', created_by || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update event
router.put('/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res) => {
    try {
        const { title, description, event_date, venue, event_type } = req.body;
        const result = await db.query(
            `UPDATE events SET title=$1, description=$2, event_date=$3, venue=$4, event_type=$5 WHERE id=$6 RETURNING *`,
            [title, description, event_date, venue, event_type, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE event
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
