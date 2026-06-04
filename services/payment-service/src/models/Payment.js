const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: String, // User ID
    required: true,
  },
  orderId: {
    type: String, // Associated Order ID
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending',
  },
  stripePaymentIntentId: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
