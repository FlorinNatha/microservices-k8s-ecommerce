const Product = require('../models/Product');
const { client } = require('../utils/redis');
// Get all products
exports.getProducts = async (req, res) => {
  try {
    const cachedProducts = await client.get('products:all');
    if (cachedProducts) {
      console.log('Serving from Redis Cache');
      return res.status(200).json(JSON.parse(cachedProducts));
    }

    const products = await Product.find();
    
    // Cache the result for 1 hour (3600 seconds)
    const responseData = {
      status: 'success',
      count: products.length,
      data: { products }
    };
    await client.setEx('products:all', 3600, JSON.stringify(responseData));

    res.status(200).json(responseData);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Invalidate the cache
    await client.del('products:all');
    
    res.status(201).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Invalidate the cache
    await client.del('products:all');

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    await product.deleteOne();

    // Invalidate the cache
    await client.del('products:all');

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
