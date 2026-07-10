const Razorpay = require('razorpay');
const crypto   = require('crypto');

// Initialize Razorpay instance
const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Creates a Razorpay order for book download
const createOrder = async (req, res) => {
  try {
    const { bookId, bookTitle, amount = 4900 } = req.body; // amount in paise (₹49 = 4900)

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `book_${bookId}_${Date.now()}`,
      notes: {
        bookId,
        bookTitle,
        userId: req.user?.id || 'guest',
      },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount:  order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};

// POST /api/payment/verify
// Verifies Razorpay signature after payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment verified ✅ — grant download access
    res.json({
      success: true,
      message: 'Payment verified! Download access granted.',
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
};

module.exports = { createOrder, verifyPayment };
