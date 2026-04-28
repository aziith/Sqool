const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

router.get('/dashboard', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // 1. Total Teachers
    const totalTeachers = await prisma.teachers.count({ where: { institution_id: institutionId } });
    
    // 2. Classes Today (Total timetable slots for today's day of week)
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayName = days[today.getDay()];
    const classesToday = await prisma.timetables.count({
       where: { classes: { institution_id: institutionId }, day_of_week: todayName }
    });

    // 3. Pending Salaries (Count of teachers whose payroll for LAST month is marked pending/non-existent)
    const month = today.getMonth() === 0 ? 12 : today.getMonth(); // previous month
    const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    
    const paidSalariesCount = await prisma.teacher_payroll.count({
       where: { institution_id: institutionId, month, year, status: 'PAID' }
    });
    const pendingSalaries = totalTeachers - paidSalariesCount;

    // 4. Teacher Attendance %
    const presentToday = await prisma.teacher_attendance.count({
        where: {
            institution_id: institutionId,
            date: today,
            status: { in: ['Present', 'Half-Day'] }
        }
    });
    const attendancePercent = totalTeachers > 0 ? Math.round((presentToday / totalTeachers) * 100) : 0;

    res.json({
        totalTeachers,
        classesToday,
        pendingSalaries: pendingSalaries > 0 ? pendingSalaries : 0,
        attendancePercent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
