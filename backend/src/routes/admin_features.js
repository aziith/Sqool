const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Events ---
router.get('/events', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query('SELECT * FROM events WHERE institution_id = $1 ORDER BY event_date', [institution_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/events', async (req, res) => {
    try {
        const { institution_id, title, description, event_date, location } = req.body;
        const result = await db.query(
            'INSERT INTO events (institution_id, title, description, event_date, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, title, description, event_date, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Transport ---
router.get('/transport', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query('SELECT * FROM transport WHERE institution_id = $1', [institution_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/transport', async (req, res) => {
    try {
        const { institution_id, route_name, vehicle_number, driver_name, driver_phone } = req.body;
        const result = await db.query(
            'INSERT INTO transport (institution_id, route_name, vehicle_number, driver_name, driver_phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, route_name, vehicle_number, driver_name, driver_phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Awards ---
router.get('/awards', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query(
            'SELECT a.*, u.name as winner_name FROM awards a JOIN users u ON a.user_id = u.id WHERE a.institution_id = $1',
            [institution_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/awards', async (req, res) => {
    try {
        const { institution_id, user_id, title, description, award_date } = req.body;
        const result = await db.query(
            'INSERT INTO awards (institution_id, user_id, title, description, award_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [institution_id, user_id, title, description, award_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Gallery ---
router.get('/gallery', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query('SELECT * FROM gallery WHERE institution_id = $1', [institution_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/gallery', async (req, res) => {
    try {
        const { institution_id, title, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO gallery (institution_id, title, image_url) VALUES ($1, $2, $3) RETURNING *',
            [institution_id, title, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
