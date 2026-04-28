const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    console.log('[Academic Subjects] Fetching for Inst ID:', institutionId, 'Original ID from query:', req.query.institution_id);
    
    try {
      if (prisma.subjects) {
        const subjectsList = await prisma.subjects.findMany({
          where: { institution_id: institutionId },
          include: {
            classes: { select: { id: true, name: true, section: true } }
          },
          orderBy: { name: 'asc' }
        });
        return res.json(subjectsList);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for subjects list");
      const result = await db.query(`
        SELECT s.*, 
        json_build_object('id', c.id, 'name', c.name, 'section', c.section) as classes
        FROM subjects s
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.institution_id = $1
        ORDER BY s.name ASC
      `, [institutionId]);
      return res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const { institution_id, class_id, name, code, max_marks } = req.body;
    const instId = parseInt(institution_id) || 1;
    const clsId = class_id ? parseInt(class_id) : null;
    const marks = parseInt(max_marks) || 100;

    try {
      if (prisma.subjects) {
        const newSubject = await prisma.subjects.create({
          data: {
            institution_id: instId,
            class_id: clsId,
            name,
            code,
            max_marks: marks
          }
        });
        return res.status(201).json(newSubject);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for subject creation");
      const result = await db.query(`
        INSERT INTO subjects (institution_id, class_id, name, code, max_marks)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [instId, clsId, name, code, marks]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      if (prisma.subjects) {
        await prisma.subjects.delete({ where: { id: parseInt(id) } });
        return res.json({ message: 'Subject deleted successfully' });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      await db.query('DELETE FROM subjects WHERE id = $1', [parseInt(id)]);
      return res.json({ message: 'Subject deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
