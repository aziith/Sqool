const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');
const institutionRoutes = require('./routes/institutions');
const studentRoutes = require('./routes/students');
const admissionRoutes = require('./routes/admissions');
const admissionSystemRoutes = require('./routes/admission_system');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api', admissionSystemRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Srpkool API is running' });
});

// Self-Healing Bootstrap (Ensures Admin & Institution always exist)
const bootstrap = async () => {
    try {
        const prisma = require('./config/prisma');
        const bcrypt = require('bcrypt');

        // 1. Ensure Institution #1 exists
        const inst = await prisma.institutions.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                name: "Sqool Academy",
                subdomain: "sqool-" + Math.floor(Math.random() * 1000)
            }
        });

        // 2. Ensure Admin account exists (iazitrex@gmail.com)
        const passHash = await bcrypt.hash('zxcvbnm', 10);
        await prisma.users.upsert({
            where: {
                email: "iazitrex@gmail.com"
            },
            update: {},
            create: {
                role: "ADMIN",
                name: "Ajit Raj",
                email: "iazitrex@gmail.com",
                password_hash: passHash,
                phone: "916201062804",
                institution_id: inst.id
            }
        });
        console.log("✅ SELF-HEALING: Admin access restored.");
    } catch (err) {
        console.error("❌ SELF-HEALING FAILED:", err.message);
    }
};

const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    await bootstrap();
});
