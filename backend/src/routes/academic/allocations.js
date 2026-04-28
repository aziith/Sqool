const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// POST /allocations → assign room (Conflict Detection included)
router.post('/', async (req, res) => {
  try {
    const { roomId, className, section, subject, teacher, date, startTime, endTime, institution_id } = req.body;

    const parsedDate = new Date(date).toISOString().split('T')[0];
    const parsedStart = `1970-01-01T${startTime}:00.000Z`;
    const parsedEnd = `1970-01-01T${endTime}:00.000Z`;

    // CRITICAL: Conflict Detection (startTime <= existing.endTime) AND (endTime >= existing.startTime)
    const conflictQuery = `
      SELECT id FROM allocations 
      WHERE "roomId" = $1 
      AND "date" = $2
      AND ("startTime" < $4 AND "endTime" > $3)
    `;
    const conflict = await db.query(conflictQuery, [roomId, parsedDate, parsedStart, parsedEnd]);

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: "Room already booked for this time slot" });
    }

    const allocId = require('crypto').randomUUID();
    const instId = institution_id ? parseInt(institution_id) : 1;

    const newAlloc = await db.query(`
      INSERT INTO allocations (id, "roomId", institution_id, "className", section, subject, teacher, date, "startTime", "endTime")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [allocId, roomId, instId, className, section, subject, teacher, parsedDate, parsedStart, parsedEnd]);

    res.status(201).json(newAlloc.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /allocations → get all allocations
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const query = `
      SELECT a.*, row_to_json(r) as room 
      FROM allocations a
      JOIN rooms r ON a."roomId" = r.id
      WHERE a.institution_id = $1
      ORDER BY a.date ASC
    `;
    const result = await db.query(query, [institutionId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
