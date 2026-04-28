require('dotenv').config();
const { pool } = require('./src/config/db');

async function diagnoseExams() {
    try {
        const res = await pool.query('SELECT id, name, start_date, end_date, created_at FROM exams');
        const upcoming = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date > NOW()');
        const completed = await pool.query('SELECT COUNT(*) FROM exams WHERE end_date < NOW()');
        const ongoing = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date <= NOW() AND end_date >= NOW()');
        
        console.log('---JSON_START---');
        console.log(JSON.stringify({
            exams: res.rows,
            now: new Date().toISOString(),
            counts: {
                upcoming: upcoming.rows[0].count,
                completed: completed.rows[0].count,
                ongoing: ongoing.rows[0].count
            }
        }, null, 2));
        console.log('---JSON_END---');
        
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

diagnoseExams();
