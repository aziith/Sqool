require('dotenv').config();
const { pool } = require('./src/config/db');

async function testExamsSave() {
    try {
        const institution_id = 3; // Based on what I've seen in other scripts
        const payload = {
            institution_id,
            name: 'Diagnostic Exam',
            type: 'Midterm',
            class_id: 1, // Assumes some class exists
            section_id: 1,
            subject_id: 1,
            start_date: '2026-04-02',
            end_date: '2026-04-03',
            description: 'Test session'
        };

        const result = await pool.query(
            `INSERT INTO exams 
            (institution_id, name, type, class_id, section_id, subject_id, start_date, end_date, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [parseInt(payload.institution_id), payload.name, payload.type, parseInt(payload.class_id), parseInt(payload.section_id), payload.subject_id ? parseInt(payload.subject_id) : null, payload.start_date, payload.end_date, payload.description]
        );
        console.log('Save Success!', result.rows[0]);
    } catch (err) {
        console.error('FAIL:', err.message);
        if (err.detail) console.error('DETAIL:', err.detail);
        if (err.hint) console.error('HINT:', err.hint);
    } finally {
        pool.end();
    }
}

testExamsSave();
