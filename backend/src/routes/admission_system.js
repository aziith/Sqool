const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

// POST /submit (Alias for /admissions but specifically for public form formats)
router.post(['/submit', '/admission'], async (req, res) => {
    try {
        const { name, applicant_name, email, phone, course, gender, class_applied, parent_phone, parent_name, institution_id } = req.body;

        const finalName = name || applicant_name;
        const finalPhone = phone || parent_phone;
        const appNo = 'APP' + Math.floor(Math.random() * 1000) + Date.now().toString().slice(-6);

        const admission = await prisma.admissions.create({
            data: {
                institution_id: parseInt(institution_id) || 1,
                applicant_name: finalName || 'New Applicant',
                email: email || `temp_${Date.now()}@school.com`,
                parent_name: parent_name || null,
                parent_phone: finalPhone?.toString() || '0000000000',
                class_applied: class_applied || course || 'N/A',
                gender: gender || 'M',
                application_no: appNo,
                status: 'PENDING'
            }
        });

        res.json({ success: true, ...admission });
    } catch (err) {
        console.error("Submission Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /all (Pipeline View)
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const admissions = await prisma.admissions.findMany({
            where: {
                institution_id: req.user.institution_id,
                status: { not: 'PAID' }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(admissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MARK AS PAID and CREATE STUDENT
router.post('/mark-paid/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const results = await prisma.$transaction(async (tx) => {
            const admission = await tx.admissions.findUnique({ where: { id: parseInt(id) } });
            if (!admission) throw new Error("Admission not found");

            const passHash = await bcrypt.hash('Student@123', 10);
            const user = await tx.users.create({
                data: {
                    institution_id: admission.institution_id || 1,
                    role: 'STUDENT',
                    name: admission.applicant_name,
                    email: admission.email,
                    password_hash: passHash,
                    phone: admission.parent_phone,
                }
            });

            await tx.students.create({
                data: {
                    user_id: user.id,
                    enrollment_number: 'ENR' + Date.now().toString().slice(-6),
                    application_no: admission.application_no,
                    class_name: admission.class_applied || 'N/A',
                    section: 'A',
                    institution_id: admission.institution_id || 1
                }
            });

            await tx.admissions.update({
                where: { id: admission.id },
                data: { status: 'PAID', registration_fee_paid: true }
            });

            return user;
        });

        res.json({ message: "Successfully enrolled scholar!", user: results });
    } catch (err) {
        console.error("Mark Paid Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE ALL ADMISSIONS (Cleanup)
router.delete('/admissions-all', authenticateToken, async (req, res) => {
    try {
        await prisma.admissions.deleteMany({
            where: { institution_id: req.user.institution_id }
        });
        res.json({ message: 'Pipeline cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
