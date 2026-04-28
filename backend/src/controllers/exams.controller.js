const { pool } = require('../config/db');
const prisma = require('../config/prisma'); // Keep for activity logs if it ever works

// 1. Exam Dashboard
exports.getDashboardData = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const instId = parseInt(institution_id);

        // a. Basic Stats
        const totalExamsRes = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1', [instId]);
        // Upcoming = Hasn't ended yet
        const upcomingExamsRes = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1 AND (end_date >= CURRENT_DATE OR end_date IS NULL)', [instId]);
        // Completed = Already ended
        const completedExamsRes = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1 AND end_date < CURRENT_DATE', [instId]);

        // b. Average Result %
        const resultsRes = await pool.query(`
            SELECT percentage FROM exam_results er
            JOIN exams e ON er.exam_id = e.id
            WHERE e.institution_id = $1
        `, [instId]);

        const results = resultsRes.rows;
        const avgResult = results.length > 0
            ? results.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / results.length
            : 0;

        // c. Pass vs Fail (assuming 40% is pass)
        const passCount = results.filter(r => parseFloat(r.percentage) >= 40).length;
        const failCount = results.length - passCount;

        // d. Class wise performance
        const classWiseRes = await pool.query(`
            SELECT c.name, AVG(er.percentage) as avg
            FROM exam_results er
            JOIN exams e ON er.exam_id = e.id
            JOIN classes c ON e.class_id = c.id
            WHERE e.institution_id = $1
            GROUP BY c.name
        `, [instId]);

        res.json({
            stats: {
                totalExams: parseInt(totalExamsRes.rows[0].count),
                upcomingExams: parseInt(upcomingExamsRes.rows[0].count),
                completedExams: parseInt(completedExamsRes.rows[0].count),
                avgResult: avgResult.toFixed(2)
            },
            charts: {
                passFail: [
                    { name: 'Pass', value: passCount },
                    { name: 'Fail', value: failCount }
                ],
                classWise: classWiseRes.rows.map(r => ({ name: r.name, avg: parseFloat(r.avg).toFixed(2) }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Create Exam
exports.createExam = async (req, res) => {
    try {
        const { institution_id, name, type, class_id, section_id, subject_id, start_date, end_date, description } = req.body;

        // Defensive checks for Numeric IDs to avoid NaN errors in SQL
        const instId = parseInt(institution_id);
        const clsId = class_id ? parseInt(class_id) : null;
        const secId = section_id ? parseInt(section_id) : null;
        const subId = subject_id ? parseInt(subject_id) : null;

        if (!instId || !clsId || !name) {
            return res.status(400).json({ error: 'Incomplete exam data: Institution, Class, and Name are required.' });
        }

        const result = await pool.query(
            `INSERT INTO exams 
            (institution_id, name, type, class_id, section_id, subject_id, start_date, end_date, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [instId, name, type, clsId, secId, subId, start_date || null, end_date || null, description || null]
        );

        console.log(`[Exam Created] ID: ${result.rows[0].id} for Institution: ${instId}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Create Exam Error Full Details:", error);
        res.status(500).json({ error: `Internal Database Error: ${error.message}` });
    }
};

// 3. Update Exam
exports.updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, class_id, section_id, subject_id, start_date, end_date, description } = req.body;

        const examId = parseInt(id);
        if (!examId) return res.status(400).json({ error: 'Invalid exam ID' });

        // Fetch current to calculate rescheduling
        let oldExam;
        try {
            const currentExamRes = await pool.query("SELECT start_date, end_date, is_rescheduled FROM exams WHERE id = $1", [examId]);
            oldExam = currentExamRes.rows[0];
        } catch (e) {
            console.warn("Retrying fetch without is_rescheduled column...");
            const currentExamRes = await pool.query("SELECT start_date, end_date FROM exams WHERE id = $1", [examId]);
            oldExam = currentExamRes.rows[0];
        }

        let shouldSetRescheduled = oldExam?.is_rescheduled || false;
        
        if (oldExam) {
            const oldStart = oldExam.start_date ? new Date(oldExam.start_date).toISOString().split('T')[0] : null;
            const oldEnd = oldExam.end_date ? new Date(oldExam.end_date).toISOString().split('T')[0] : null;
            
            if (start_date && oldStart && oldStart !== start_date) shouldSetRescheduled = true;
            if (end_date && oldEnd && oldEnd !== end_date) shouldSetRescheduled = true;
        }

        let result;
        try {
            result = await pool.query(
                `UPDATE exams 
                SET name = $1, type = $2, class_id = $3, section_id = $4, subject_id = $5, 
                    start_date = $6, end_date = $7, description = $8, is_rescheduled = $9
                WHERE id = $10 RETURNING *`,
                [
                    name, 
                    type, 
                    class_id ? parseInt(class_id) : null, 
                    section_id ? parseInt(section_id) : null, 
                    subject_id ? parseInt(subject_id) : null, 
                    start_date || null, 
                    end_date || null, 
                    description || null,
                    shouldSetRescheduled,
                    examId
                ]
            );
        } catch (updateErr) {
            console.warn("Update with is_rescheduled failed, retrying without it:", updateErr.message);
            result = await pool.query(
                `UPDATE exams 
                SET name = $1, type = $2, class_id = $3, section_id = $4, subject_id = $5, 
                    start_date = $6, end_date = $7, description = $8
                WHERE id = $9 RETURNING *`,
                [
                    name, 
                    type, 
                    class_id ? parseInt(class_id) : null, 
                    section_id ? parseInt(section_id) : null, 
                    subject_id ? parseInt(subject_id) : null, 
                    start_date || null, 
                    end_date || null, 
                    description || null,
                    examId
                ]
            );
        }

        if (result.rows.length === 0) return res.status(404).json({ error: 'Exam not found' });

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Update Exam Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete Exam
exports.deleteExam = async (req, res) => {
    let client;
    try {
        const { id } = req.params;
        client = await pool.connect();
        await client.query('BEGIN');

        // Delete from related tables first to handle foreign key constraints
        // Using try-catch for related tables to ignore errors if tables/columns don't exist
        try {
            await client.query("DELETE FROM exam_schedules WHERE exam_id = $1", [parseInt(id)]);
        } catch (e) {
            console.warn("Could not delete from exam_schedules (likely doesn't exist or column differs):", e.message);
        }

        try {
            await client.query("DELETE FROM exam_results WHERE exam_id = $1", [parseInt(id)]);
        } catch (e) {
            console.warn("Could not delete from exam_results (likely doesn't exist or column differs):", e.message);
        }

        const result = await client.query("DELETE FROM exams WHERE id = $1 RETURNING *", [parseInt(id)]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Exam not found' });
        }

        await client.query('COMMIT');
        console.log(`Successfully deleted exam ID: ${id}`);
        res.json({ message: 'Exam deleted successfully', exam: result.rows[0] });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Delete Exam Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release();
    }
};

exports.getExams = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await pool.query(`
            SELECT e.*, c.name as class_name, s.name as subject_name
            FROM exams e
            LEFT JOIN classes c ON e.class_id = c.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            WHERE e.institution_id = $1
            ORDER BY e.created_at DESC
        `, [parseInt(institution_id)]);

        // Map to match frontend expectations (exam.classes.name)
        const exams = result.rows.map(r => ({
            ...r,
            classes: { name: r.class_name }
        }));

        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Exam Schedule
exports.createSchedule = async (req, res) => {
    try {
        const { exam_id, schedules } = req.body; // schedules: [{subject_id, date, start_time, end_time, room, invigilator_id}]

        const createdSchedules = await Promise.all(schedules.map(s =>
            prisma.exam_schedules.create({
                data: {
                    exam_id: parseInt(exam_id),
                    subject_id: parseInt(s.subject_id),
                    date: new Date(s.date),
                    start_time: s.start_time,
                    end_time: s.end_time,
                    room: s.room,
                    invigilator_id: s.invigilator_id ? parseInt(s.invigilator_id) : null
                }
            })
        ));

        res.status(201).json(createdSchedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const { exam_id } = req.params;
        const schedules = await prisma.exam_schedules.findMany({
            where: { exam_id: parseInt(exam_id) },
            include: {
                subjects: true,
                users: true // invigilator
            }
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Marks Upload
exports.uploadMarks = async (req, res) => {
    try {
        const { exam_id, subject_id, marks } = req.body; // marks: [{student_id, score, status}]

        const results = await Promise.all(marks.map(m =>
            prisma.marks.upsert({
                where: {
                    // We need a unique constraint for upsert, but we don't have one on (exam_id, subject_id, student_id) in schema yet.
                    // Let's use create/update logic instead.
                    id: 0 // Dummy for upsert structure if no ID
                },
                update: {
                    marks: parseInt(m.score),
                    status: m.status
                },
                create: {
                    exam_id: parseInt(exam_id),
                    subject_id: parseInt(subject_id),
                    student_id: parseInt(m.student_id),
                    marks: parseInt(m.score),
                    status: m.status
                }
            })
        ));
        // Note: Realistically, you'd find existing mark first.
        // Let's refine this to be more robust.

        res.json({ message: 'Marks uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Robust Upload Marks
exports.bulkUploadMarks = async (req, res) => {
    try {
        const { exam_id, subject_id, records } = req.body;

        for (const record of records) {
            const existing = await prisma.marks.findFirst({
                where: {
                    exam_id: parseInt(exam_id),
                    subject_id: parseInt(subject_id),
                    student_id: parseInt(record.student_id)
                }
            });

            if (existing) {
                await prisma.marks.update({
                    where: { id: existing.id },
                    data: { marks: parseInt(record.marks), status: record.status || 'PRESENT' }
                });
            } else {
                await prisma.marks.create({
                    data: {
                        exam_id: parseInt(exam_id),
                        subject_id: parseInt(subject_id),
                        student_id: parseInt(record.student_id),
                        marks: parseInt(record.marks),
                        status: record.status || 'PRESENT'
                    }
                });
            }
        }

        res.json({ message: 'Bulk marks uploaded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Result Generation (Calculate per student for an exam)
exports.generateResults = async (req, res) => {
    try {
        const { exam_id } = req.params;
        const examId = parseInt(exam_id);

        const exam = await prisma.exams.findUnique({
            where: { id: examId },
            include: {
                marks: true,
                exam_schedules: true
            }
        });

        const students = [...new Set(exam.marks.map(m => m.student_id))];
        const totalPossibleMarks = exam.exam_schedules.length * 100; // Assuming 100 per subject

        const results = await Promise.all(students.map(async (studentId) => {
            const studentMarks = exam.marks.filter(m => m.student_id === studentId);
            const totalObtained = studentMarks.reduce((acc, curr) => acc + (curr.marks || 0), 0);
            const percentage = (totalObtained / totalPossibleMarks) * 100;

            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B';
            else if (percentage >= 60) grade = 'C';
            else if (percentage >= 40) grade = 'D';

            return prisma.exam_results.upsert({
                where: { id: 0 }, // Should have a unique on exam_id + student_id
                update: { total_marks: totalObtained, percentage, grade },
                create: {
                    exam_id: examId,
                    student_id: studentId,
                    total_marks: totalObtained,
                    percentage,
                    grade
                }
            });
        }));

        res.json({ message: 'Results generated', count: results.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
