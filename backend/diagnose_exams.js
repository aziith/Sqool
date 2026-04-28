require('dotenv').config();
const { pool } = require('./src/config/db');

async function diagnoseExams() {
    try {
        const res = await pool.query('SELECT id, name, start_date, end_date, created_at FROM exams');
        console.log('--- Current Exams in Database ---');
        console.table(res.rows.map(r => ({
            ...r,
            start_date: r.start_date ? r.start_date.toISOString() : null,
            end_date: r.end_date ? r.end_date.toISOString() : null,
            now: new Date().toISOString()
        })));
        
        const upcoming = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date > NOW()');
        const completed = await pool.query('SELECT COUNT(*) FROM exams WHERE end_date < NOW()');
        const ongoing = await pool.query('SELECT COUNT(*) FROM exams WHERE start_date <= NOW() AND end_date >= NOW()');
        
        console.log('\nCounts according to SQL (NOW() = ' + new Date().toISOString() + '):');
        console.log('Upcoming:', upcoming.rows[0].count);
        console.log('Completed:', completed.rows[0].count);
        console.log('Ongoing:', ongoing.rows[0].count);
        
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

diagnoseExams();
