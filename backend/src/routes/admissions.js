const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

const { authenticateToken } = require('../middleware/auth');

// POST /api/admissions (The Universal Admission Point)
router.post('/', async (req, res) => {
    try {
        console.log("Receiving admission submission...");
        const {
            applicant_name, name, email, phone, course, class_applied,
            parent_phone, parent_name, gender, institution_id, address,
            current_address, guardian_id_proof, student_id_proof
        } = req.body;

        // Universal Mapping
        const finalName = applicant_name || name || 'New Scholar';
        const finalPhone = parent_phone || phone || '0000000000';
        const finalEmail = email || `temp_${Date.now()}@school.com`;
        const finalClass = class_applied || course || 'N/A';

        const appNo = 'APP' + Math.floor(Math.random() * 1000) + Date.now().toString().slice(-6);

        // Fallback for institution_id
        const finalInstitutionId = req.user?.institution_id || parseInt(institution_id) || 1;

        const admission = await prisma.admissions.create({
            data: {
                applicant_name: finalName,
                email: finalEmail,
                parent_name: parent_name || null,
                parent_phone: finalPhone.toString(),
                class_applied: finalClass,
                gender: gender || 'M',
                address: address || null,
                current_address: current_address || null,
                guardian_id_proof: guardian_id_proof || null,
                student_id_proof: student_id_proof || null,
                application_no: appNo,
                status: 'PENDING',
                institution_id: finalInstitutionId
            }
        });

        res.status(201).json(admission);
    } catch (err) {
        console.error("Submission Crash Point:", err.message);
        res.status(500).json({ error: "DB Failure: Data was not saved. " + err.message });
    }
});

// GET all admissions (Multi-tenant Restricted)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        let where = { institution_id: req.user.institution_id };

        if (status && status !== 'ALL') {
            where.status = status;
        }

        const admissions = await prisma.admissions.findMany({
            where: where,
            orderBy: { created_at: 'desc' }
        });
        res.json(admissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admissions/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.admissions.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
