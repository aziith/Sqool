const { Pool } = require('pg');
require('dotenv').config({ path: 'src/.env' }); // Adjust if .env is in root or src

const pool = new Pool({
    connectionString: "postgresql://postgres:Rexxdb%4012@localhost:5432/Skool" || process.env.DATABASE_URL,
});

async function cleanup() {
    const client = await pool.connect();
    try {
        console.log("Starting full student database cleanup...");
        await client.query('BEGIN');

        // 1. Delete dependent records first (Manual Cascade)
        console.log("- Cleaning up attendance, fees, and transport...");
        await client.query('DELETE FROM transport_assign');
        await client.query('DELETE FROM student_transport');
        await client.query('DELETE FROM fee_payments');
        await client.query('DELETE FROM attendance');
        await client.query('DELETE FROM exam_results');
        await client.query('DELETE FROM marks');
        await client.query('DELETE FROM homework_submissions');

        // 2. Clear Admission Portal data
        console.log("- Clearing admission portal (Admission Portal)...");
        await client.query('DELETE FROM admission_students');
        // If there's an admissions (legacy) table, clear it too
        await client.query('DELETE FROM admissions');

        // 3. Clear Students profiles
        console.log("- Clearing Student Directory...");
        await client.query('DELETE FROM students');

        // 4. Delete Users with role 'STUDENT'
        console.log("- Removing Student Login Accounts...");
        const res = await client.query("DELETE FROM users WHERE role = 'STUDENT' RETURNING id");
        
        await client.query('COMMIT');
        console.log(`\n✅ Success: All student data removed. (${res.rowCount} accounts deleted)`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("\n❌ Cleanup Failed:", err.message);
    } finally {
        client.release();
        process.exit();
    }
}

cleanup();
