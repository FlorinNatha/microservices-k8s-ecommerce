const Order = require('../models/Order');

// Create new order
exports.addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No order items' });
    } else {
      const order = new Order({
        orderItems,
        user: req.user.id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json({
        status: 'success',
        data: { order: createdOrder }
      });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Allow only the user who created it or admin
      if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ status: 'error', message: 'Not authorized to view this order' });
      }
      res.status(200).json({ status: 'success', data: { order } });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Update order to paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // This would normally come from a payment gateway (e.g. Stripe, PayPal)
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();

      res.status(200).json({ status: 'success', data: { order: updatedOrder } });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get logged in user orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({
      status: 'success',
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get all orders (Admin only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({
      status: 'success',
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
