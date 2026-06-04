const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const Payment = require('../models/Payment');

// Process a payment intent
exports.processPayment = async (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ status: 'error', message: 'Please provide amount and orderId' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: currency || 'usd',
      metadata: { orderId, userId: req.user.id },
    });

    // Record the payment intent in database
    const paymentRecord = await Payment.create({
      user: req.user.id,
      orderId,
      amount,
      currency: currency || 'usd',
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentRecord._id
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Webhook or explicit status update
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ status: 'error', message: 'Payment record not found' });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
