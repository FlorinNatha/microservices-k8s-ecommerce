module.exports = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    prefix: '/api/auth'
  },
  users: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:5001',
    prefix: '/api/users'
  },
  products: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
    prefix: '/api/products'
  },
  orders: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
    prefix: '/api/orders'
  },
  payments: {
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
    prefix: '/api/payments'
  }
};
