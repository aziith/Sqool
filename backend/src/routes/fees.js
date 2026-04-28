const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const feesController = require('../controllers/fees.controller');

router.get('/', authenticateToken, feesController.getFeesList);
router.post('/assign', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), feesController.assignFee);
router.post('/pay', authenticateToken, feesController.collectPayment);

module.exports = router;
