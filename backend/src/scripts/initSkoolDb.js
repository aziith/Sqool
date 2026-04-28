const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const initDb = async () => {
    try {
        console.log('Initializing Skool database with default data...');

        // Create a default institution
        const institution = await prisma.institutions.upsert({
            where: { subdomain: 'skool' },
            update: {},
            create: {
                name: 'Skool Default Academy',
                subdomain: 'skool',
                email: 'info@skool.com',
                plan: 'PREMIUM',
                is_active: true
            }
        });

        console.log(`Institution created/verified: ${institution.name}`);

        // Create a default Super Admin
        const hash = await bcrypt.hash('admin123', 10);
        const admin = await prisma.users.upsert({
            where: { email: 'admin@skool.com' },
            update: {},
            create: {
                institution_id: institution.id,
                role: 'SUPER_ADMIN',
                name: 'Super Admin',
                email: 'admin@skool.com',
                password_hash: hash
            }
        });

        console.log('Default SUPER_ADMIN created: admin@skool.com / admin123');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await prisma.$disconnect();
    }
};

initDb();
