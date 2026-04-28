const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

// GET all students (ULTIMATE SYNC: Shows All Records from EVERYWHERE)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const instId = req.user.institution_id;
        console.log(`Ultimate Sync Initiated for Institution: ${instId}`);

        // 1. Fetch Enrolled (Isolate to this institution)
        const enrolledUsers = await prisma.users.findMany({
            where: {
                role: 'STUDENT',
                institution_id: instId
            },
            include: { students: true }
        });

        // 2. Fetch Admissions (Pending Pipeline)
        const allAdmissions = await prisma.admissions.findMany({
            where: { institution_id: instId },
            orderBy: { created_at: 'desc' }
        });

        const combined = [];

        // Add User Accounts (Already Enrolled)
        enrolledUsers.forEach(u => {
            combined.push({
                id: u.id,
                name: u.name,
                email: u.email || 'N/A',
                phone: u.phone || 'N/A',
                status: 'ENROLLED',
                enrollment_number: u.students?.enrollment_number || 'REG-PENDING',
                class_name: u.students?.class_name || 'N/A',
                section: u.students?.section || 'A',
                roll_number: u.students?.roll_number || null,
                date_of_birth: u.students?.date_of_birth || null
            });
        });

        // Add All Admissions (Pipeline Record)
        allAdmissions.forEach(a => {
            combined.push({
                id: `adm-${a.id}`,
                name: a.applicant_name,
                email: a.email || 'N/A',
                phone: a.parent_phone || 'N/A',
                status: a.status || 'PENDING',
                enrollment_number: a.application_no || 'APP-STAGE',
                class_name: a.class_applied || 'N/A',
                section: '—',
                roll_number: null,
                date_of_birth: a.applied_date || a.created_at // Fallback for sorting/view
            });
        });

        console.log(`Successfully Unified ${combined.length} scholars for Inst: ${instId}`);
        res.json(combined);
    } catch (err) {
        console.error("Ultimate Sync Crash:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Bulk Import Students (Integrated into the Unified Pipeline)
router.post('/bulk', authenticateToken, async (req, res) => {
    try {
        const { students } = req.body;
        const instId = req.user.institution_id;

        const results = { importedCount: 0, linkedCount: 0, failedCount: 0, errors: [] };

        for (const s of students) {
            try {
                // Check if already exists to prevent duplicates
                const existing = await prisma.admissions.findFirst({
                    where: { email: s.email, institution_id: instId }
                });

                if (existing) {
                    results.linkedCount++;
                    continue;
                }

                const appNo = 'IMP' + Math.floor(Math.random() * 1000) + Date.now().toString().slice(-6);
                await prisma.admissions.create({
                    data: {
                        applicant_name: s.name,
                        email: s.email,
                        parent_phone: s.phone?.toString() || '0000000000',
                        class_applied: s.class_name || 'N/A',
                        status: 'ENROLLED',
                        application_no: appNo,
                        institution_id: instId
                    }
                });
                results.importedCount++;
            } catch (err) {
                results.failedCount++;
                results.errors.push({ name: s.name, error: err.message });
            }
        }
        res.json(results);
    } catch (err) {
        console.error("Bulk Import Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete specific record (Handles both types)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const instId = req.user.institution_id;

        if (id.startsWith('adm-')) {
            const realId = parseInt(id.replace('adm-', ''));
            // Added check for institution_id
            await prisma.admissions.delete({
                where: { id: realId, institution_id: instId }
            });
        } else {
            // If it's a real user ID
            await prisma.users.delete({
                where: { id: parseInt(id), institution_id: instId }
            });
        }
        res.json({ message: 'Removal successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear All Students for an institution
router.delete('/all', authenticateToken, async (req, res) => {
    try {
        const instId = req.user.institution_id;
        await prisma.admissions.deleteMany({ where: { institution_id: instId } });
        await prisma.users.deleteMany({ where: { institution_id: instId, role: 'STUDENT' } });
        res.json({ message: 'Database wiped' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
