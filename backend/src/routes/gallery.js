const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const galleryController = require('../controllers/gallery.controller');

router.get('/albums', authenticateToken, galleryController.getAlbums);
router.post('/albums', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), galleryController.createAlbum);
router.post('/media', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), galleryController.uploadMedia);
router.delete('/media/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), galleryController.deleteMedia);

module.exports = router;
