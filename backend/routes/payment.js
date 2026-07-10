const express = require('express');
const router  = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/payment/create-order  (protected)
router.post('/create-order', protect, createOrder);

// POST /api/payment/verify  (protected)
router.post('/verify', protect, verifyPayment);

module.exports = router;
