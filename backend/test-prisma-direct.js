const { PrismaClient } = require('@prisma/client');

console.log("Starting Prisma direct connection test...");

const prisma = new PrismaClient({
    datasourceUrl: "postgresql://postgres:Rexxdb%4012@localhost:5432/attendx"
});

async function main() {
    try {
        console.log("Attempting to connect and query...");
        // Test a simple query
        const count = await prisma.users.count();
        console.log("SUCCESS: Connection established. User count:", count);
    } catch (err) {
        console.error("FAILURE during query:", err.message);
        console.error(err.stack);
    } finally {
        await prisma.$disconnect();
    }
}

main();
