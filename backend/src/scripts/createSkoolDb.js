const { Pool } = require('pg');
require('dotenv').config();

const createDb = async () => {
    // Connect to the default 'postgres' database to create 'Skool'
    // We assume DATABASE_URL is "postgresql://postgres:Rexxdb%4012@localhost:5432/Skool"
    const url = process.env.DATABASE_URL.replace('/Skool', '/postgres');

    const pool = new Pool({
        connectionString: url
    });

    try {
        console.log('Connecting to postgres to create Skool database...');
        await pool.query('CREATE DATABASE "Skool"');
        console.log('Database Skool created successfully!');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database Skool already exists.');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await pool.end();
    }
};

createDb();
