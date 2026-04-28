require('dotenv').config();
const { pool } = require('./src/config/db');
const fs = require('fs');

async function diagnoseExams() {
    try {
        const res = await pool.query('SELECT id, name, start_date, end_date, created_at FROM exams');
        const upcoming = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date > NOW()');
        const completed = await pool.query('SELECT COUNT(*) FROM exams WHERE end_date < NOW()');
        const ongoing = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date <= NOW() AND end_date >= NOW()');
        
        const data = {
            exams: res.rows,
            now: new Date().toISOString(),
            counts: {
                upcoming: upcoming.rows[0].count,
                completed: completed.rows[0].count,
                ongoing: ongoing.rows[0].count
            }
        };
        
        fs.writeFileSync('exams_data.json', JSON.stringify(data, null, 2));
        console.log('Data written to exams_data.json');
        
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

diagnoseExams();
