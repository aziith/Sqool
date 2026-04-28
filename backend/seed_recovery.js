const prisma = require('./src/config/prisma');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log("--- DISASTER RECOVERY SEED START ---");

        // 1. Create Default Institution
        const inst = await prisma.institutions.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                name: "Sqool Academy",
                address: "System Default",
                phone: "1234567890",
                email: "admin@sqool.com",
            }
        });
        console.log("Institution #1 Recovered.");

        // 2. Create Admin Account
        const hash = await bcrypt.hash('Ajit@123', 10);
        await prisma.users.upsert({
            where: { email: 'ajitraj9599@gmail.com' },
            update: { password_hash: hash }, // Reset password just in case
            create: {
                institution_id: inst.id,
                role: 'ADMIN',
                name: 'Ajit Raj',
                email: 'ajitraj9599@gmail.com',
                password_hash: hash,
                phone: '916201062804',
                is_active: true
            }
        });
        console.log("Admin Account 'ajitraj9599@gmail.com' Restored.");
        console.log("Password set to: Ajit@123");

        console.log("--- RECOVERY SUCCESSFUL ---");
    } catch (err) {
        console.error("SEEDING ERROR:", err.message);
    } finally {
        process.exit();
    }
}

seed();
