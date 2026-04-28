const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all announcements for an institution
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { status } = req.query; // active, scheduled, archived

    let whereClause = 'WHERE institution_id = $1';
    const params = [institutionId];

    if (status === 'active') {
      whereClause += ' AND (scheduled_at IS NULL OR scheduled_at <= CURRENT_TIMESTAMP) AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)';
    } else if (status === 'scheduled') {
      whereClause += ' AND scheduled_at > CURRENT_TIMESTAMP';
    } else if (status === 'archived') {
      whereClause += ' AND expires_at <= CURRENT_TIMESTAMP';
    }

    const { rows } = await db.query(`
      SELECT a.*, 
      (SELECT COUNT(*) FROM announcement_views v WHERE v.announcement_id = a.id) as view_count,
      (SELECT json_agg(aud.*) FROM announcement_audiences aud WHERE aud.announcement_id = a.id) as audiences,
      (SELECT json_agg(att.*) FROM announcement_attachments att WHERE att.announcement_id = a.id) as attachments
      FROM announcements a
      ${whereClause}
      ORDER BY a.is_urgent DESC, a.created_at DESC
    `, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create announcement
router.post('/', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { 
      institution_id, title, message, category, is_urgent, 
      scheduled_at, expires_at, created_by, 
      audiences, attachments 
    } = req.body;

    await client.query('BEGIN');

    const announcementRes = await client.query(`
      INSERT INTO announcements (institution_id, title, message, category, is_urgent, scheduled_at, expires_at, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [
      parseInt(institution_id) || 1, title, message, category || 'GENERAL', 
      is_urgent || false, scheduled_at || null, expires_at || null, 
      created_by ? parseInt(created_by) : null
    ]);

    const announcement_id = announcementRes.rows[0].id;

    // Handle Audiences
    if (audiences && Array.isArray(audiences)) {
      for (const aud of audiences) {
        await client.query(`
          INSERT INTO announcement_audiences (announcement_id, type, value)
          VALUES ($1, $2, $3)
        `, [announcement_id, aud.type, aud.value]);
      }
    }

    // Handle Attachments
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        await client.query(`
          INSERT INTO announcement_attachments (announcement_id, url, type)
          VALUES ($1, $2, $3)
        `, [announcement_id, att.url, att.type]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json(announcementRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Mark as seen
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // Optional check for existing view
    const existing = await db.query('SELECT * FROM announcement_views WHERE announcement_id = $1 AND user_id = $2', [id, user_id]);
    if (existing.rows.length === 0) {
      await db.query('INSERT INTO announcement_views (announcement_id, user_id) VALUES ($1, $2)', [id, user_id]);
    }
    
    res.json({ message: 'View recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, category, is_urgent, scheduled_at, expires_at } = req.body;
    
    const { rows } = await db.query(`
      UPDATE announcements SET title = $1, message = $2, category = $3, is_urgent = $4, scheduled_at = $5, expires_at = $6
      WHERE id = $7 RETURNING *
    `, [title, message, category, is_urgent, scheduled_at, expires_at, id]);
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
