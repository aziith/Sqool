const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Get assignments for a class or teacher
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { class_id, teacher_id } = req.query;

    const whereClause = { institution_id: institutionId };
    if (class_id) whereClause.class_id = parseInt(class_id);
    if (teacher_id) whereClause.teacher_id = parseInt(teacher_id);

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        classes: { select: { name: true, section: true } },
        subjects: { select: { name: true } },
        users: { select: { name: true } }, // Teacher
        _count: { select: { submissions: true } }
      },
      orderBy: { due_date: 'asc' }
    });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create an assignment
router.post('/', async (req, res) => {
  try {
    const { institution_id, class_id, subject_id, teacher_id, title, description, file_url, due_date } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        institution_id: parseInt(institution_id) || 1,
        class_id: parseInt(class_id),
        subject_id: parseInt(subject_id),
        teacher_id: parseInt(teacher_id),
        title,
        description,
        file_url,
        due_date: new Date(due_date)
      }
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits an assignment
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, file_url, student_note } = req.body;

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignment_id: parseInt(id),
        student_id: parseInt(student_id),
        file_url,
        student_note
      }
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grade/Review a submission
router.patch('/submissions/:subId', async (req, res) => {
  try {
    const { subId } = req.params;
    const { grade, feedback } = req.body;

    const updated = await prisma.assignmentSubmission.update({
      where: { id: parseInt(subId) },
      data: { grade, feedback }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.assignment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
