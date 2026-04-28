require('dotenv').config();
try {
    const prisma = require('./src/config/prisma');
    console.log('Successfully loaded Prisma Client!');
    process.exit(0);
} catch (error) {
    console.error('Error loading Prisma Client:');
    console.error(error.message);
    process.exit(1);
}
