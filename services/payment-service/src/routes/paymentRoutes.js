const express = require('express');
const { processPayment, updatePaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/process', protect, processPayment);
router.put('/status', protect, updatePaymentStatus); // Typically this might be a webhook from Stripe

module.exports = router;
