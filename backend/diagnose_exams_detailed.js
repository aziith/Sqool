require('dotenv').config();
const { pool } = require('./src/config/db');

async function diagnoseExamsDetailed() {
    try {
        const institution_id = 1;
        console.log(`Checking stats for institution_id: ${institution_id}`);
        
        const allExams = await pool.query('SELECT id, name, institution_id, start_date, end_date FROM exams');
        console.log('\n--- All Exams ---');
        console.table(allExams.rows);
        
        const total = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1', [institution_id]);
        const upcoming = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1 AND (end_date >= CURRENT_DATE OR end_date IS NULL)', [institution_id]);
        const completed = await pool.query('SELECT COUNT(*) FROM exams WHERE institution_id = $1 AND end_date < CURRENT_DATE', [institution_id]);
        
        console.log('\n--- Stats based on Updated Logic ---');
        console.log('Total:', total.rows[0].count);
        console.log('Upcoming:', upcoming.rows[0].count);
        console.log('Completed:', completed.rows[0].count);
        
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

diagnoseExamsDetailed();
