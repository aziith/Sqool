const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get weekly timetable for a class
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const classId = parseInt(req.query.class_id);

    if (!classId) return res.status(400).json({ error: 'class_id is required' });

    try {
      if (prisma.timetables) {
        const schedule = await prisma.timetables.findMany({
          where: { class_id: classId, subjects: { institution_id: institutionId } },
          include: {
            subjects: { select: { name: true, code: true } },
            users: { select: { name: true, employee_id: true } }
          },
          orderBy: [
            { day_of_week: 'asc' },
            { start_time: 'asc' }
          ]
        });
        return res.json(schedule);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for timetable list");
      const result = await db.query(`
        SELECT t.*, 
        json_build_object('name', s.name, 'code', s.code) as subjects,
        json_build_object('name', u.name) as users
        FROM timetables t
        LEFT JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN users u ON t.teacher_id = u.id
        WHERE t.class_id = $1
        ORDER BY 
          CASE t.day_of_week 
            WHEN 'Monday' THEN 1 
            WHEN 'Tuesday' THEN 2 
            WHEN 'Wednesday' THEN 3 
            WHEN 'Thursday' THEN 4 
            WHEN 'Friday' THEN 5 
            WHEN 'Saturday' THEN 6 
            WHEN 'Sunday' THEN 7 
          END ASC, 
          t.start_time ASC
      `, [classId]);
      return res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new timetable entry (with conflict detection)
router.post('/', async (req, res) => {
  try {
    const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number } = req.body;
    
    // Parse time
    const start = new Date(`1970-01-01T${start_time}Z`);
    const end = new Date(`1970-01-01T${end_time}Z`);

    try {
      if (prisma.timetables) {
        const teacherConflict = await prisma.timetables.findFirst({
          where: {
            teacher_id: parseInt(teacher_id),
            day_of_week,
            OR: [
              { start_time: { lte: start }, end_time: { gt: start } },
              { start_time: { lt: end }, end_time: { gte: end } }
            ]
          }
        });

        if (teacherConflict) {
          return res.status(409).json({ error: 'Teacher is already assigned to a class during this time.' });
        }

        const newEntry = await prisma.timetables.create({
          data: {
            institution_id: parseInt(req.body.institution_id) || 1,
            class_id: parseInt(class_id),
            subject_id: parseInt(subject_id),
            teacher_id: parseInt(teacher_id),
            day_of_week,
            start_time: start,
            end_time: end,
            room_number
          }
        });

        return res.status(201).json(newEntry);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for timetable creation");
      const instId = parseInt(req.body.institution_id) || 1;
      const result = await db.query(`
        INSERT INTO timetables (institution_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [instId, parseInt(class_id), parseInt(subject_id), parseInt(teacher_id), day_of_week, start_time, end_time, room_number]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a period
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, teacher_id, day_of_week, start_time, end_time, room_number } = req.body;
    
    const start = new Date(`1970-01-01T${start_time}Z`);
    const end = new Date(`1970-01-01T${end_time}Z`);

    try {
      if (prisma.timetables) {
        const updated = await prisma.timetables.update({
          where: { id: parseInt(id) },
          data: {
            institution_id: parseInt(req.body.institution_id) || 1,
            subject_id: parseInt(subject_id),
            teacher_id: parseInt(teacher_id),
            day_of_week,
            start_time: start,
            end_time: end,
            room_number
          }
        });
        return res.json(updated);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for timetable update");
      const instId = parseInt(req.body.institution_id) || 1;
      const result = await db.query(`
        UPDATE timetables 
        SET subject_id = $1, teacher_id = $2, day_of_week = $3, start_time = $4, end_time = $5, room_number = $6, institution_id = $7
        WHERE id = $8
        RETURNING *
      `, [parseInt(subject_id), parseInt(teacher_id), day_of_week, start_time, end_time, room_number, instId, parseInt(id)]);
      return res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get timetable for a student's class
router.get('/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    try {
      if (prisma.students) {
        const student = await prisma.students.findUnique({ where: { user_id: parseInt(userId) } });
        if (!student) return res.status(404).json({ error: 'Student profile not found' });
        
        let classId = student.class_id;
        if (!classId && student.class_name) {
          const cls = await prisma.classes.findFirst({
            where: { name: student.class_name, section: student.section, institution_id: student.institution_id }
          });
          if (cls) classId = cls.id;
        }

        if (!classId) return res.status(404).json({ error: 'Student is not assigned to any class.' });

        const schedule = await prisma.timetables.findMany({
          where: { class_id: classId },
          include: {
            subjects: { select: { name: true, code: true } },
            users: { select: { name: true } }
          },
          orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }]
        });
        return res.json(schedule);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for student timetable");
      const studentResult = await db.query('SELECT * FROM students WHERE user_id = $1', [parseInt(userId)]);
      if (studentResult.rows.length === 0) return res.status(404).json({ error: 'Student profile not found' });
      
      const student = studentResult.rows[0];
      let classId = student.class_id;
      
      if (!classId && student.class_name) {
        const clsResult = await db.query('SELECT id FROM classes WHERE name = $1 AND section = $2 AND institution_id = $3', [student.class_name, student.section, student.institution_id]);
        if (clsResult.rows.length > 0) classId = clsResult.rows[0].id;
      }

      if (!classId) return res.status(404).json({ error: 'Student is not assigned to any class.' });

      const scheduleResult = await db.query(`
        SELECT t.*, 
        json_build_object('name', s.name, 'code', s.code) as subjects,
        json_build_object('name', u.name) as users
        FROM timetables t
        LEFT JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN users u ON t.teacher_id = u.id
        WHERE t.class_id = $1
        ORDER BY 
          CASE t.day_of_week 
            WHEN 'Monday' THEN 1 
            WHEN 'Tuesday' THEN 2 
            WHEN 'Wednesday' THEN 3 
            WHEN 'Thursday' THEN 4 
            WHEN 'Friday' THEN 5 
            WHEN 'Saturday' THEN 6 
            WHEN 'Sunday' THEN 7 
          END ASC, 
          t.start_time ASC
      `, [classId]);
      return res.json(scheduleResult.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a period
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      if (prisma.timetables) {
        await prisma.timetables.delete({ where: { id: parseInt(id) } });
        return res.json({ message: 'Period removed successfully' });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      await db.query('DELETE FROM timetables WHERE id = $1', [parseInt(id)]);
      return res.json({ message: 'Period removed successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
