const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, restrictTo('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, restrictTo('admin'), updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

module.exports = router;
