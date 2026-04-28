require('dotenv').config();
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with explicit configuration.
// In Prisma 7.5.0, providing explicit options helps avoid initialization failures
// that can occur due to environment variable timing or strict configuration requirements.
const prisma = new PrismaClient({
  log: ['error', 'warn']
});

module.exports = prisma;
