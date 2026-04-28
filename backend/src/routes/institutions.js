const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// Middleware to check super admin
const isSuperAdmin = (req, res, next) => {
    // In real app, verify JWT here
    if (req.user && req.user.role === 'SUPER_ADMIN') next();
    else res.status(403).json({ error: 'Forbidden' });
};

// Create an institution
router.post('/', async (req, res) => {
    try {
        const { name, subdomain, subscription_plan } = req.body;

        const { rows } = await pool.query(
            'INSERT INTO institutions (name, subdomain, subscription_plan) VALUES ($1, $2, $3) RETURNING *',
            [name, subdomain, subscription_plan || 'basic']
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List institutions
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM institutions');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
