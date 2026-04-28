const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const bcrypt = require('bcrypt');

// Get all faculty profiles (Teachers + Staff)
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    
    // 1. Fetch teachers
    const teachersResult = await db.query(
      `SELECT u.id, u.name, u.email, COALESCE(t.phone, u.phone) as phone, 'TEACHER' as role, 
              t.employee_id, t.department, t.subjects, t.address, t.qualification, t.experience_years, t.joining_date, t.photo_url
       FROM users u 
       JOIN teachers t ON u.id = t.user_id 
       WHERE u.institution_id = $1`,
      [institutionId]
    );

    // 2. Fetch staffs
    const staffsResult = await db.query(
      `SELECT u.id, u.name, u.email, COALESCE(s.phone, u.phone) as phone, s.role, 
              s.employee_id, s.department, s.subjects, s.address, s.qualification, s.joining_date, s.photo_url
       FROM users u 
       JOIN staffs s ON u.id = s.user_id 
       WHERE u.institution_id = $1`,
      [institutionId]
    );

    // 3. Get workload metrics for teachers
    const workloadResult = await db.query(
      `SELECT teacher_id, COUNT(DISTINCT subject_id) as subjects_count, COUNT(DISTINCT class_id) as classes_count
       FROM teacher_subjects 
       WHERE institution_id = $1 
       GROUP BY teacher_id`,
      [institutionId]
    );
    
    const timetableResult = await db.query(
      `SELECT teacher_id, COUNT(*) as lectures_count
       FROM timetables 
       WHERE teacher_id IS NOT NULL 
       GROUP BY teacher_id`
    );

    const formattedTeachers = teachersResult.rows.map(p => {
      const w = workloadResult.rows.find(wl => wl.teacher_id === p.id);
      const tt = timetableResult.rows.find(t => t.teacher_id === p.id);
      return {
        ...p,
        subjects_assigned: parseInt(w?.subjects_count) || 0,
        classes_assigned: parseInt(w?.classes_count) || 0,
        lectures_per_week: parseInt(tt?.lectures_count) || 0
      };
    });

    const formattedStaffs = staffsResult.rows.map(p => {
      return {
        ...p,
        subjects_assigned: 0,
        classes_assigned: 0,
        lectures_per_week: 0
      };
    });
    
    res.json([...formattedTeachers, ...formattedStaffs]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Onboard Faculty (Teacher or Staff)
router.post('/onboard', async (req, res) => {
    console.log('Onboarding hit:', req.body);
    const client = await db.pool.connect();
    try {
        console.log('Starting transaction');
        await client.query('BEGIN');
        const { 
            name, email, password, role, 
            phone, address, department, subjects, qualification, 
            employee_id, institution_id, experience_years, photo_url
        } = req.body;

        const instId = parseInt(institution_id) || 1;
        const hashedPassword = await bcrypt.hash(password || 'Password@123', 10);

        // 1. Create User
        const userResult = await client.query(
            `INSERT INTO users (institution_id, role, name, email, password_hash, phone)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [instId, role.toUpperCase(), name, email, hashedPassword, phone || null]
        );
        const user_id = userResult.rows[0].id;

        // 2. Create Profile
        if (role.toUpperCase() === 'TEACHER') {
            await client.query(
                `INSERT INTO teachers (user_id, employee_id, department, subjects, phone, address, qualification, experience_years, institution_id, joining_date, photo_url)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10)`,
                [
                    user_id, 
                    employee_id || `TCH-${Date.now()}`, 
                    department, subjects, phone, address, qualification, 
                    parseInt(experience_years) || 0, instId, photo_url
                ]
            );
        } else {
            await client.query(
                `INSERT INTO staffs (user_id, employee_id, role, department, subjects, phone, address, qualification, institution_id, joining_date, photo_url)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10)`,
                [
                    user_id, 
                    employee_id || `STF-${Date.now()}`, 
                    role.toUpperCase(), 
                    department, subjects, phone, address, qualification, instId, photo_url
                ]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Faculty onboarded successfully', userId: user_id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Onboarding ERROR:', err.stack);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Update faculty profile
router.put('/:id', async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { phone, qualification, experience_years, department, subjects, address, photo_url } = req.body;
    
    // 1. Update User (for phone)
    if (phone) {
        await client.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, id]);
    }

    // 2. Check and Update Profile
    const teacherResult = await client.query('SELECT user_id FROM teachers WHERE user_id = $1', [id]);
    
    let updated;
    if (teacherResult.rows.length > 0) {
      updated = await client.query(
        `UPDATE teachers SET phone=$1, address=$2, subjects=$3, qualification=$4, experience_years=$5, department=$6, photo_url=$7 
         WHERE user_id=$8 RETURNING *`,
        [phone, address, subjects, qualification, experience_years ? parseInt(experience_years) : null, department, photo_url, id]
      );
    } else {
      updated = await client.query(
        `UPDATE staffs SET phone=$1, address=$2, subjects=$3, qualification=$4, department=$5, photo_url=$6 
         WHERE user_id=$7 RETURNING *`,
        [phone, address, subjects, qualification, department, photo_url, id]
      );
    }
    
    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
