const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get overall performance analytics
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;

    try {
      if (prisma.classes && prisma.subjects) {
        // Total stats
        const totalClasses = await prisma.classes.count({ where: { institution_id: institutionId } });
        const totalSubjects = await prisma.subjects.count({ where: { institution_id: institutionId } });
        const upcomingExams = await prisma.academicEvent?.count({
          where: {
            institution_id: institutionId,
            event_type: 'EXAM',
            start_date: { gte: new Date() }
          }
        }) || 0;

        const pendingAssignments = await prisma.assignment?.count({
          where: {
            institution_id: institutionId,
            due_date: { gte: new Date() }
          }
        }) || 0;

        // Today's classes schedule
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const dayOfWeek = startOfToday.toLocaleString('en-US', { weekday: 'long' });

        const todaysClasses = await prisma.timetables?.findMany({
          where: {
            subjects: { institution_id: institutionId },
            day_of_week: dayOfWeek
          },
          include: {
            classes: { select: { name: true, section: true } },
            subjects: { select: { name: true } },
            users: { select: { name: true } }
          },
          orderBy: { start_time: 'asc' }
        }) || [];

        return res.json({
          stats: {
            total_classes: totalClasses,
            total_subjects: totalSubjects,
            upcoming_exams: upcomingExams,
            pending_assignments: pendingAssignments
          },
          todays_schedule: todaysClasses
        });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for analytics");

      const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
      
      const countsResult = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM classes WHERE institution_id = $1) as total_classes,
          (SELECT COUNT(*) FROM subjects WHERE institution_id = $1) as total_subjects
      `, [institutionId]);

      const counts = countsResult.rows[0];

      const scheduleResult = await db.query(`
        SELECT t.*, 
        json_build_object('name', c.name, 'section', c.section) as classes,
        json_build_object('name', s.name, 'code', s.code) as subjects,
        json_build_object('name', u.name) as users
        FROM timetables t
        LEFT JOIN classes c ON t.class_id = c.id
        LEFT JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN users u ON t.teacher_id = u.id
        WHERE c.institution_id = $1 AND t.day_of_week = $2
        ORDER BY t.start_time ASC
      `, [institutionId, dayOfWeek]);

      return res.json({
        stats: {
          total_classes: parseInt(counts.total_classes),
          total_subjects: parseInt(counts.total_subjects),
          upcoming_exams: 0,
          pending_assignments: 0
        },
        todays_schedule: scheduleResult.rows
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
