const express = require('express');
const router = express.Router();
const db = require('../config/db');
const prisma = require('../config/prisma');

// GET all circulars
router.get('/', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query(
            `SELECT c.*, u.name as published_by_name 
             FROM circulars c 
             LEFT JOIN users u ON c.published_by = u.id
             WHERE c.institution_id = $1 
             ORDER BY c.created_at DESC`,
            [institution_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create circular
router.post('/', async (req, res) => {
    try {
        const { institution_id, title, content, target_role, expiry_date, published_by } = req.body;
        const result = await db.query(
            `INSERT INTO circulars (institution_id, title, content, target_role, expiry_date, published_by)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [institution_id, title, content, target_role, expiry_date, published_by || null]
        );

        // LOG ACTIVITY
        try {
            await prisma.activity_logs.create({
                data: {
                    institution_id: parseInt(institution_id),
                    action: 'Circular posted',
                    details: `${title} - Published to ${target_role || 'All'}`,
                    type: 'CIRCULAR'
                }
            });
        } catch (logErr) { console.error("Logging error:", logErr); }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE circular
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM circulars WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
