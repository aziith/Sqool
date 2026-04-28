const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get lesson plans for a teacher or class
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { teacher_id, class_id } = req.query;

    try {
      if (prisma.lessonPlan) {
        const whereClause = { institution_id: institutionId };
        if (teacher_id) whereClause.teacher_id = parseInt(teacher_id);
        if (class_id) whereClause.class_id = parseInt(class_id);

        const lessons = await prisma.lessonPlan.findMany({
          where: whereClause,
          include: {
            classes: { select: { name: true, section: true } },
            subjects: { select: { name: true } },
            users: { select: { name: true } }
          },
          orderBy: { date: 'desc' }
        });
        return res.json(lessons);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for lesson plans list");
      let query = `
        SELECT l.*, 
        json_build_object('name', c.name, 'section', c.section) as classes,
        json_build_object('name', sub.name) as subjects,
        json_build_object('name', u.name) as users
        FROM lesson_plans l
        LEFT JOIN classes c ON l.class_id = c.id
        LEFT JOIN subjects sub ON l.subject_id = sub.id
        LEFT JOIN users u ON l.teacher_id = u.id
        WHERE l.institution_id = $1
      `;
      let params = [institutionId];
      if (teacher_id) {
        query += ` AND l.teacher_id = $2`;
        params.push(teacher_id);
      }
      if (class_id) {
        query += ` AND l.class_id = $${params.length + 1}`;
        params.push(class_id);
      }
      query += ` ORDER BY l.date DESC`;
      const result = await db.query(query, params);
      return res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new lesson plan
router.post('/', async (req, res) => {
  try {
    const { institution_id, class_id, subject_id, teacher_id, topic, date, homework, materials_used } = req.body;
    
    try {
      if (prisma.lessonPlan) {
        const newPlan = await prisma.lessonPlan.create({
          data: {
            institution_id: parseInt(institution_id) || 1,
            class_id: parseInt(class_id),
            subject_id: parseInt(subject_id),
            teacher_id: parseInt(teacher_id),
            topic,
            date: new Date(date),
            homework,
            materials_used
          }
        });
        return res.status(201).json(newPlan);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for lesson plan creation");
      const result = await db.query(`
        INSERT INTO lesson_plans (institution_id, class_id, subject_id, teacher_id, topic, date, homework, materials_used)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
      `, [parseInt(institution_id) || 1, parseInt(class_id), parseInt(subject_id), teacher_id ? parseInt(teacher_id) : null, topic, date, homework, materials_used]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete lesson plan
router.delete('/:id', async (req, res) => {
  try {
    try {
      if (prisma.lessonPlan) {
        await prisma.lessonPlan.delete({ where: { id: parseInt(req.params.id) } });
        return res.json({ message: 'Lesson plan deleted successfully' });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      await db.query('DELETE FROM lesson_plans WHERE id = $1', [parseInt(req.params.id)]);
      return res.json({ message: 'Lesson plan deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
