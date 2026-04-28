const express = require('express');
const router = express.Router();
const examsController = require('../controllers/exams.controller');

// Dashboard & Analytics
router.get('/dashboard', examsController.getDashboardData);

// Exams
router.get('/', examsController.getExams);
router.post('/', examsController.createExam);
router.put('/:id', examsController.updateExam);
router.delete('/:id', examsController.deleteExam);

// Schedule
router.get('/:exam_id/schedule', examsController.getSchedule);
router.post('/schedule', examsController.createSchedule);

// Marks & Results
router.post('/marks/bulk', examsController.bulkUploadMarks);
router.post('/:exam_id/generate-results', examsController.generateResults);

module.exports = router;
