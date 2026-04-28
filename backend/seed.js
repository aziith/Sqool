const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log('--- SEEDING START ---');

    // 1. Create Institution
    const inst = await prisma.institutions.upsert({
        where: { subdomain: 'demo' },
        update: {},
        create: {
            name: 'Demo International School',
            subdomain: 'demo',
            email: 'admin@demo.edu',
            phone: '1234567890',
            address: '123 Education Lane',
            plan: 'FREE'
        }
    });
    console.log('Institution:', inst.name);

    // 2. Create Admin User
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const adminUser = await prisma.users.upsert({
        where: { email: 'admin@demo.edu' },
        update: {},
        create: {
            institution_id: inst.id,
            role: 'ADMIN',
            name: 'System Admin',
            email: 'admin@demo.edu',
            password_hash: adminHash
        }
    });
    console.log('Admin User:', adminUser.email);

    // 3. Create Class
    const classObj = await prisma.classes.create({
        data: {
            institution_id: inst.id,
            name: 'Grade 10',
            section: 'A'
        }
    });
    console.log('Class:', classObj.name);

    console.log('--- SEEDING COMPLETE ---');
}

main()
    .catch((e) => {
        console.error('SEEDING ERROR:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
