const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const transportController = require('../controllers/transport.controller');

router.get('/vehicles', authenticateToken, transportController.getVehicles);
router.post('/vehicles', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), transportController.createVehicle);
router.get('/routes', authenticateToken, transportController.getRoutes);
router.post('/routes', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), transportController.createRoute);
router.post('/assign', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), transportController.assignTransport);

module.exports = router;
