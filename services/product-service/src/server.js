const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Prometheus Metrics Setup
const client = require('prom-client');
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(cors());

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Product Service is running' });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/product-db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5002;

const { connectRabbitMQ, consumeEvent } = require('./utils/rabbitmq');
const { connectRedis } = require('./utils/redis');
const Product = require('./models/Product');

app.listen(PORT, async () => {
  console.log(`Product Service running on port ${PORT}`);
  await connectDB();
  await connectRabbitMQ();
  await connectRedis();

  // Listen for orders to update inventory
  consumeEvent('ORDER_CREATED', async (data) => {
    try {
      const orderItems = data.orderItems;
      for (let item of orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.stock >= item.qty) {
          product.stock -= item.qty;
          await product.save();
          console.log(`Updated stock for product ${product._id}`);
        }
      }
    } catch (error) {
      console.error('Error processing ORDER_CREATED event', error);
    }
  });
});

