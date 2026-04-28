const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createTables() {
  try {
    // Rooms Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        capacity INTEGER DEFAULT 40,
        building VARCHAR(255),
        floor VARCHAR(50),
        facilities TEXT[],
        status VARCHAR(50) DEFAULT 'AVAILABLE',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Rooms table created/verified');

    // Allocations Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS allocations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "roomId" UUID REFERENCES rooms(id) ON DELETE CASCADE,
        institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        "className" VARCHAR(255) NOT NULL,
        section VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Allocations table created/verified');
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

createTables();
