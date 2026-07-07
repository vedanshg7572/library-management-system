const express = require('express');
const router = express.Router();
const { 
  borrowBook, 
  returnBook, 
  getMyTransactions, 
  getAllTransactions, 
  collectFine 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Borrow book (Student only)
router.post('/borrow', protect, authorize('student'), borrowBook);

// Return book (Logged-in Student or Admin)
router.post('/return/:id', protect, returnBook);

// Get current student's borrowing logs (Student only)
router.get('/my-borrowings', protect, authorize('student'), getMyTransactions);

// Get all transaction logs (Admin only)
router.get('/all', protect, authorize('admin'), getAllTransactions);

// Pay/Settle fine (Admin only)
router.put('/fine/:id/pay', protect, authorize('admin'), collectFine);

module.exports = router;
