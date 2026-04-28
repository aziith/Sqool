const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Fetch attendance
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { date, teacher_id } = req.query;

    let whereClause = { institution_id: institutionId };
    
    // Support either daily fetching for all teachers or date range for a specific teacher
    if (date) {
       whereClause.date = new Date(date);
    }
    if (teacher_id) {
       whereClause.teacher_id = parseInt(teacher_id);
    }

    const attendance = await prisma.teacher_attendance.findMany({
      where: whereClause,
      include: {
        users_teacher: { select: { id: true, name: true, teachers: { select: { employee_id: true } } } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark daily attendance (upsert)
router.post('/', async (req, res) => {
  try {
    const { institution_id, teacher_id, date, status, remarks, marked_by } = req.body;
    
    const parsedDate = new Date(date);

    const record = await prisma.teacher_attendance.upsert({
      where: {
        teacher_id_date: {
          teacher_id: parseInt(teacher_id),
          date: parsedDate
        }
      },
      update: {
        status,
        remarks,
        marked_by: marked_by ? parseInt(marked_by) : null
      },
      create: {
        institution_id: parseInt(institution_id) || 1,
        teacher_id: parseInt(teacher_id),
        date: parsedDate,
        status,
        remarks,
        marked_by: marked_by ? parseInt(marked_by) : null
      }
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get overall stats for dashboard
router.get('/stats', async (req, res) => {
    try {
        const institutionId = parseInt(req.query.institution_id) || 1;
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const totalTeachers = await prisma.teachers.count({ where: { institution_id: institutionId } });
        
        const presentToday = await prisma.teacher_attendance.count({
            where: {
                institution_id: institutionId,
                date: today,
                status: { in: ['Present', 'Half-Day'] }
            }
        });

        const attendancePercent = totalTeachers > 0 ? Math.round((presentToday / totalTeachers) * 100) : 0;
        
        res.json({ attendancePercent, presentToday, totalTeachers });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
