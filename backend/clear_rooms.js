const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE rooms CASCADE;`);
  console.log('Cleared rooms table');
}

main().catch(console.error).finally(() => prisma.$disconnect());
