const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Order Service is running' });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/order-db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5003;

const { connectRabbitMQ, consumeEvent } = require('./utils/rabbitmq');
const Order = require('./models/Order');

app.listen(PORT, async () => {
  console.log(`Order Service running on port ${PORT}`);
  await connectDB();
  await connectRabbitMQ();

  // Listen for payments to update order status
  consumeEvent('PAYMENT_SUCCESS', async (data) => {
    try {
      const order = await Order.findById(data.orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        await order.save();
        console.log(`Order ${order._id} marked as paid`);
      }
    } catch (error) {
      console.error('Error processing PAYMENT_SUCCESS event', error);
    }
  });
});
