const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Helper to get start and end of current month
const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
};

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        const institutionId = parseInt(req.query.institution_id) || 1;
        const { start, end } = getMonthRange();

        try {
            if (prisma.students && prisma.teachers) {
                // 1. Total Students
                const totalStudents = await prisma.students.count({
                    where: { institution_id: institutionId }
                });

                // 2. Total Teachers
                const totalTeachers = await prisma.teachers.count({
                    where: { institution_id: institutionId }
                });

                // 3. Ratio
                const ratio = totalTeachers > 0 ? `1:${Math.round(totalStudents / totalTeachers)}` : 'N/A';

                // 4. Avg Attendance % (Student)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const presentCount = await prisma.attendance.count({
                    where: {
                        student_id: { not: null },
                        date: today,
                        status: 'Present'
                    }
                });
                const avgAttendance = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

                // 5. Monthly Revenue
                const revenue = await prisma.fees.aggregate({
                    where: {
                        institution_id: institutionId,
                        payment_date: { gte: start, lte: end },
                        status: 'Paid'
                    },
                    _sum: { amount: true }
                });

                return res.json({
                    totalStudents,
                    totalTeachers,
                    ratio,
                    avgAttendance: `${avgAttendance}%`,
                    revenue: revenue._sum.amount || 0
                });
            }
            throw new Error("Prisma not available");
        } catch (prismaErr) {
            console.log("Falling back to raw SQL for admin stats");
            const result = await db.query(`
                SELECT 
                    (SELECT COUNT(*) FROM students WHERE institution_id = $1) as total_students,
                    (SELECT COUNT(*) FROM users WHERE institution_id = $1 AND role = 'TEACHER') as total_teachers,
                    (SELECT COALESCE(SUM(amount), 0) FROM fees WHERE institution_id = $1 AND status = 'Paid' AND payment_date BETWEEN $2 AND $3) as revenue,
                    (SELECT COUNT(*) FROM students WHERE institution_id = $1 AND created_at >= CURRENT_DATE) as new_admissions,
                    (SELECT COALESCE(SUM(amount), 0) FROM fees WHERE institution_id = $1 AND status != 'Paid') as pending_fees
            `, [institutionId, start, end]);

            const row = result.rows[0];
            const ts = parseInt(row.total_students) || 0;
            const tt = parseInt(row.total_teachers) || 0;
            const rev = parseFloat(row.revenue) || 0;
            const na = parseInt(row.new_admissions) || 0;
            const pf = parseFloat(row.pending_fees) || 0;

            return res.json({
                totalStudents: ts,
                totalTeachers: tt,
                ratio: tt > 0 ? `1:${Math.round(ts / tt)}` : 'N/A',
                avgAttendance: '0%', 
                revenue: rev,
                newAdmissions: na,
                pendingFees: pf
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/attendance-trends
router.get('/attendance-trends', async (req, res) => {
    try {
        const institutionId = parseInt(req.query.institution_id) || 1;
        const days = 7; // Last 7 days
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const studentPresent = await prisma.attendance.count({
                where: { date, status: 'Present' }
            });
            const studentTotal = await prisma.students.count({
                where: { institution_id: institutionId }
            });

            const teacherPresent = await prisma.teacher_attendance.count({
                where: { institution_id: institutionId, date, status: 'Present' }
            });
            const teacherTotal = await prisma.teachers.count({
                where: { institution_id: institutionId }
            });

            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            data.push({
                name: dayName,
                studentAttendance: studentTotal > 0 ? Math.round((studentPresent / studentTotal) * 100) : 0,
                teacherAttendance: teacherTotal > 0 ? Math.round((teacherPresent / teacherTotal) * 100) : 0
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/class-strength
router.get('/class-strength', async (req, res) => {
    try {
        const institutionId = parseInt(req.query.institution_id) || 1;
        const classes = await prisma.classes.findMany({
            where: { institution_id: institutionId },
            include: {
                _count: { select: { students: true } }
            }
        });

        const formatted = classes.map(c => ({
            name: c.class_name,
            students: c._count.students
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', async (req, res) => {
    try {
        const institutionId = parseInt(req.query.institution_id) || 1;
        const logs = await prisma.activity_logs.findMany({
            where: { institution_id: institutionId },
            orderBy: { created_at: 'desc' },
            take: 10,
            include: { users: { select: { name: true } } }
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
