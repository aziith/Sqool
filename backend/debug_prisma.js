require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function debug() {
    console.log("Starting Prisma Debug...");
    console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
    
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            },
            log: ['query', 'info', 'warn', 'error']
        });
        console.log("Prisma instance created. Attempting to connect...");
        await prisma.$connect();
        console.log("SUCCESS: Prisma connected to database.");
        
        const count = await prisma.exams.count();
        console.log("Exams count:", count);
        
        await prisma.$disconnect();
    } catch (err) {
        console.error("PRISMA INITIALIZATION ERROR DETECTED:");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        if (err.stack) console.error("Stack Trace:", err.stack);
    }
}

debug();
