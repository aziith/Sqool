const { Pool } = require('pg');
require('dotenv').config();

const createDb = async () => {
    // Connect to the default 'postgres' database to create 'attendx'
    const url = process.env.DATABASE_URL.replace('/attendx', '/postgres');

    const pool = new Pool({
        connectionString: url
    });

    try {
        console.log('Connecting to postgres to create attendx database...');
        await pool.query('CREATE DATABASE attendx');
        console.log('Database attendx created successfully!');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database attendx already exists.');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await pool.end();
    }
};

createDb();
