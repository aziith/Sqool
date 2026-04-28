const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET /api/rooms - List all rooms
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    
    // We fetch rooms along with class names assigned to them 
    const query = `
      SELECT r.*,
      (
        SELECT json_agg(json_build_object(
          'id', a.id, 'className', a."className", 'section', a.section, 
          'subject', a.subject, 'teacher', a.teacher, 
          'date', a.date, 'startTime', a."startTime", 'endTime', a."endTime"
        ))
        FROM allocations a
        WHERE a."roomId" = r.id AND a.date >= CURRENT_DATE AND a.institution_id = $1
      ) as allocations
      FROM rooms r
      WHERE r.institution_id = $1
      ORDER BY r.name ASC
    `;

    const result = await db.query(query, [institutionId]);
    
    const formedRooms = result.rows.map(room => {
      const activeClass = room.allocations ? room.allocations.find(a => a.className) : null;
      return {
        ...room,
        allocations: room.allocations || [],
        assigned_class: activeClass ? `${activeClass.className} ${activeClass.section}` : null
      };
    });

    res.json(formedRooms);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms - Create a room
router.post('/', async (req, res) => {
  try {
    const { name, type, capacity, building, floor, facilities, status, institution_id } = req.body;
    const instId = parseInt(institution_id) || 1;

    const roomId = require('crypto').randomUUID();

    const existing = await db.query('SELECT id FROM rooms WHERE name = $1 AND institution_id = $2', [name, instId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Room number / name already exists' });
    }

    const result = await db.query(`
      INSERT INTO rooms (id, name, type, capacity, building, floor, facilities, status, institution_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      roomId, name, type || 'CLASSROOM', parseInt(capacity) || 40, building || null, floor || null, 
      facilities || [], status || 'AVAILABLE', instId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

// PUT /rooms/:id - Update room
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, building, floor, facilities, status } = req.body;
    const updatedAt = new Date();
    
    const result = await db.query(`
      UPDATE rooms 
      SET name = $1, type = $2, capacity = $3, building = $4, floor = $5, facilities = $6, status = $7, "updatedAt" = $8
      WHERE id = $9
      RETURNING *
    `, [name, type, parseInt(capacity) || 40, building || null, floor || null, facilities || [], status, updatedAt, id]);

    res.json(result.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

// DELETE /rooms/:id - Delete room
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM rooms WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
