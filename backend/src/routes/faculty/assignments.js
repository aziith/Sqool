const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Get teacher assignments
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { teacher_id } = req.query;

    let whereClause = { institution_id: institutionId };
    if (teacher_id) whereClause.teacher_id = parseInt(teacher_id);

    const assignments = await prisma.teacher_subjects.findMany({
      where: whereClause,
      include: {
        users: { select: { id: true, name: true } },
        subjects: true,
        classes: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign subject to teacher
router.post('/', async (req, res) => {
  try {
    const { institution_id, teacher_id, subject_id, class_id } = req.body;
    
    // Ensure uniqueness
    const existing = await prisma.teacher_subjects.findFirst({
      where: {
         institution_id: parseInt(institution_id) || 1,
         teacher_id: parseInt(teacher_id),
         subject_id: parseInt(subject_id),
         class_id: parseInt(class_id)
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Teacher is already assigned to this subject and class." });
    }

    const assignment = await prisma.teacher_subjects.create({
      data: {
        institution_id: parseInt(institution_id) || 1,
        teacher_id: parseInt(teacher_id),
        subject_id: parseInt(subject_id),
        class_id: parseInt(class_id)
      },
      include: {
        users: { select: { name: true } },
        subjects: true,
        classes: true
      }
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove assignment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.teacher_subjects.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Assignment removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
