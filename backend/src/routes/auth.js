const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const { pool } = require('../config/db');
const prisma = require('../config/prisma');
const { sendOTPEmail } = require('../config/emailService');

const router = express.Router();

router.get('/test', (req, res) => res.json({ message: 'Auth router test ok' }));

// Request OTP (Bypassed for now)
router.post('/request-otp', async (req, res) => {
    try {
        const { identifier } = req.body;
        console.log(`[OTP BYPASS] Requested for: ${identifier}`);
        res.json({
            message: 'OTP sent successfully (Bypassed)',
            otp: '123456'
        });
    } catch (err) {
        res.status(200).json({ message: 'OTP flow bypassed' });
    }
});

// Verify OTP (Bypassed for now)
router.post('/verify-otp', async (req, res) => {
    res.json({ message: 'OTP verified successfully (Bypassed)' });
});

router.post('/register', async (req, res) => {
    try {
        const { campusName, adminName, email, password, phone } = req.body;

        if (!email || !password || !campusName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Check if email already exists
        const exitingUser = await prisma.users.findUnique({ where: { email } });
        if (exitingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const subdomain = campusName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(Math.random() * 10000);

        // 2. Multi-tenant Transaction
        const result = await prisma.$transaction(async (tx) => {
            // A. Create Institution
            const school = await tx.institutions.create({
                data: {
                    name: campusName,
                    subdomain: subdomain,
                    email: email,
                    phone: phone || null
                }
            });

            // B. Create Admin User linked to school
            const user = await tx.users.create({
                data: {
                    name: adminName,
                    email: email,
                    password_hash: passwordHash,
                    role: 'ADMIN',
                    phone: phone || null,
                    institutions: {
                        connect: { id: school.id }
                    }
                }
            });

            return { school, user };
        });

        console.log(`✅ CAMPUS CREATED: ${campusName} (ID: ${result.school.id})`);

        res.status(201).json({
            message: 'Campus registered successfully',
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role
            }
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        // Get user with institution info (using LEFT JOIN to prevent crashes if inst is missing)
        const { rows } = await pool.query(`
            SELECT u.*, i.name as institution_name 
            FROM users u 
            LEFT JOIN institutions i ON u.institution_id = i.id 
            WHERE u.email = $1
        `, [email.toLowerCase().trim()]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // Check password
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const payload = {
            id: user.id,
            role: user.role,
            institution_id: user.institution_id
        };
        const token = jwt.encode(payload, process.env.JWT_SECRET || 'secret');

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                phone: user.phone,
                institution_id: user.institution_id,
                institution_name: user.institution_name
            }
        });
    } catch (err) {
        console.error('[Login Error]', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const { authenticateToken } = require('../middleware/auth');

// Get Profile (User + Institution)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { id, institution_id } = req.user;

        const userRes = await pool.query(
            'SELECT id, name, email, phone, role FROM users WHERE id = $1',
            [id]
        );

        const instRes = await pool.query(
            'SELECT * FROM institutions WHERE id = $1',
            [institution_id]
        );

        res.json({
            user: userRes.rows[0],
            institution: instRes.rows[0]
        });
    } catch (err) {
        console.error('Profile Fetch Error:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update Personal Profile
router.post('/update-profile', authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { name, phone } = req.body;

        const { rows } = await pool.query(
            'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, name, email, phone, role',
            [name, phone, id]
        );

        res.json({ message: 'Profile updated successfully', user: rows[0] });
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update Institution Info
router.post('/update-institution', authenticateToken, async (req, res) => {
    try {
        const { institution_id, role } = req.user;
        if (role !== 'ADMIN') return res.status(403).json({ error: 'Only admins can update institution info' });

        const { name, phone, email, address, logo_url } = req.body;

        const { rows } = await pool.query(
            'UPDATE institutions SET name = $1, phone = $2, email = $3, address = $4, logo_url = $5 WHERE id = $6 RETURNING *',
            [name, phone, email, address, logo_url, institution_id]
        );

        res.json({ message: 'Institution info updated successfully', institution: rows[0] });
    } catch (err) {
        console.error('Institution Update Error:', err);
        res.status(500).json({ error: 'Failed to update institution info' });
    }
});

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        // Check current password
        const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
        const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);

        if (!valid) return res.status(400).json({ error: 'Incorrect current password' });

        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, id]);

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Password Change Error:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Reset Password using OTP
router.post('/reset-password', async (req, res) => {
    try {
        const { identifier, otp, newPassword } = req.body;
        if (!identifier || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required' });

        const cleanIdentifier = identifier.trim().toLowerCase();

        // Check if OTP matches and is verified
        const { rows: otpRows } = await pool.query(
            'SELECT * FROM otp_verifications WHERE identifier = $1 AND otp = $2 AND verified = TRUE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [cleanIdentifier, otp]
        );

        if (otpRows.length === 0) {
            return res.status(400).json({ error: 'Invalid or unverified OTP. Please verify OTP first.' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        // Update user password
        const { rowCount } = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 OR phone = $3',
            [newHash, cleanIdentifier, cleanIdentifier]
        );

        if (rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the used OTP to prevent reuse
        await pool.query('DELETE FROM otp_verifications WHERE id = $1', [otpRows[0].id]);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
