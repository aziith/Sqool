const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Get study materials for a class or subject
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { class_id, subject_id } = req.query;

    const whereClause = { institution_id: institutionId };
    if (class_id) whereClause.class_id = parseInt(class_id);
    if (subject_id) whereClause.subject_id = parseInt(subject_id);

    const materials = await prisma.studyMaterial.findMany({
      where: whereClause,
      include: {
        classes: { select: { name: true, section: true } },
        subjects: { select: { name: true } },
        users: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload a new study material
router.post('/', async (req, res) => {
  try {
    const { institution_id, class_id, subject_id, teacher_id, title, description, file_type, file_url } = req.body;
    
    const newMaterial = await prisma.studyMaterial.create({
      data: {
        institution_id: parseInt(institution_id) || 1,
        class_id: parseInt(class_id),
        subject_id: parseInt(subject_id),
        teacher_id: parseInt(teacher_id),
        title,
        description,
        file_type: file_type || 'DOC',
        file_url
      }
    });

    res.status(201).json(newMaterial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete material
router.delete('/:id', async (req, res) => {
  try {
    await prisma.studyMaterial.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Study material deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
