const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const libraryController = require('../controllers/library.controller');

// Books
router.get('/books', authenticateToken, libraryController.getBooks);
router.post('/books', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), libraryController.createBook);
router.put('/books/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), libraryController.updateBook);
router.delete('/books/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), libraryController.deleteBook);

// Issues
router.post('/issue', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), libraryController.issueBook);
router.post('/return', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), libraryController.returnBook);

module.exports = router;
