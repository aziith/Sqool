const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get all classes with sections and class teachers
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    console.log('[Academic Classes] Fetching for Inst ID:', institutionId, 'Original ID from query:', req.query.institution_id);
    
    // Check if prisma is a mock (has get method that returns empty)
    // Or just try-catch with a fallback to raw SQL
    let classesList;
    try {
      if (prisma.classes) {
        classesList = await prisma.classes.findMany({
          where: { institution_id: institutionId },
          include: {
            users: { select: { id: true, name: true, employee_id: true } }, // Class teacher
            _count: { select: { students: true } } // Student count
          },
          orderBy: { name: 'asc' }
        });

        // Format response
        const formatted = classesList.map(c => ({
          ...c,
          teacher_name: c.users?.name || 'Unassigned',
          student_count: c._count.students
        }));
        return res.json(formatted);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for classes list");
      const result = await db.query(`
        SELECT c.*, u.name as teacher_name, 
        (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) as student_count
        FROM classes c
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE c.institution_id = $1
        ORDER BY c.name ASC
      `, [institutionId]);
      return res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new class/section
router.post('/', async (req, res) => {
  try {
    const { institution_id, name, section, capacity, teacher_id, room_number } = req.body;
    const instId = parseInt(institution_id) || 1;
    const cap = parseInt(capacity) || 40;
    const tId = teacher_id ? parseInt(teacher_id) : null;

    try {
      if (prisma.classes) {
        // ... (omitted for brevity)
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for class creation:", { instId, name, section, cap, tId });
      const result = await db.query(`
        INSERT INTO classes (institution_id, name, section, capacity, teacher_id, room_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [instId, name, section, cap, tId, room_number]);
      console.log("Class created successfully in DB:", result.rows[0]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update class details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, section, capacity, teacher_id, room_number } = req.body;
    const clsId = parseInt(id);
    const cap = parseInt(capacity);
    const tId = teacher_id ? parseInt(teacher_id) : null;

    try {
      if (prisma.classes) {
        const updatedClass = await prisma.classes.update({
          where: { id: clsId },
          data: { name, section, capacity: cap, teacher_id: tId }
        });
        return res.json(updatedClass);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      const result = await db.query(`
        UPDATE classes 
        SET name = $1, section = $2, capacity = $3, teacher_id = $4, room_number = $6
        WHERE id = $5
        RETURNING *
      `, [name, section, cap, tId, clsId, room_number]);
      return res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clsId = parseInt(id);

    try {
      if (prisma.classes) {
        await prisma.classes.delete({ where: { id: clsId } });
        return res.json({ message: 'Class deleted successfully' });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      await db.query('DELETE FROM classes WHERE id = $1', [clsId]);
      return res.json({ message: 'Class deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
