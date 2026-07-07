const express = require('express');
const router = express.Router();
const { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Get all books (Any logged-in user)
router.get('/', protect, getBooks);

// Get book by ID (Any logged-in user)
router.get('/:id', protect, getBookById);

// Create book (Admin only)
router.post('/', protect, authorize('admin'), createBook);

// Update book details (Admin only)
router.put('/:id', protect, authorize('admin'), updateBook);

// Delete book (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
