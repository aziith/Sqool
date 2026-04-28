const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const awardsController = require('../controllers/awards.controller');

router.get('/', authenticateToken, awardsController.getAwards);
router.post('/', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), awardsController.createAward);
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), awardsController.deleteAward);

module.exports = router;
