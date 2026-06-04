const express = require('express');
const { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  getMyOrders, 
  getOrders 
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, restrictTo('admin'), getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

module.exports = router;
