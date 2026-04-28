const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET all teachers for an institution
router.get('/', async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await db.query(
            `SELECT t.*, u.name, u.email
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             WHERE u.institution_id = $1`,
            [institution_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a teacher
router.post('/', async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const {
            institution_id, name, email, phone, password,
            employee_id, department, qualification, joining_date, salary
        } = req.body;

        const password_hash = await bcrypt.hash(password || 'Teacher@123', 10);
        const userResult = await client.query(
            `INSERT INTO users (institution_id, role, name, email, password_hash, phone)
             VALUES ($1,'TEACHER',$2,$3,$4,$5) RETURNING id`,
            [institution_id, name, email, password_hash, phone || null]
        );
        const user_id = userResult.rows[0].id;

        const empId = employee_id || 'EMP' + Date.now();
        const teacherResult = await client.query(
            `INSERT INTO teachers (user_id, employee_id, department, qualification, joining_date, salary)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [user_id, empId, department, qualification, joining_date || null, salary || null]
        );

        await client.query('COMMIT');
        res.status(201).json({ ...teacherResult.rows[0], name, email, phone });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// PUT update teacher
router.put('/:id', async (req, res) => {
    try {
        const { department, qualification, salary } = req.body;
        const result = await db.query(
            `UPDATE teachers SET department=$1, qualification=$2, salary=$3 WHERE id=$4 RETURNING *`,
            [department, qualification, salary, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE teacher
router.delete('/:id', async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const t = await client.query('SELECT user_id FROM teachers WHERE id=$1', [req.params.id]);
        await client.query('DELETE FROM teachers WHERE id=$1', [req.params.id]);
        if (t.rows.length > 0) {
            await client.query('DELETE FROM users WHERE id=$1', [t.rows[0].user_id]);
        }
        await client.query('COMMIT');
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
