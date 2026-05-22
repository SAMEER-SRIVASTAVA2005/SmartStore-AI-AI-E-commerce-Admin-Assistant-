const Product = require('../models/Product');

// @desc    Get all products for logged-in store owner
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const { title, description, price, category, stock, tags, marketingCaption } = req.body;

  try {
    if (!title || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields' });
    }

    // Dynamic mock stats generation to populate analytics dashboard beautifully
    const mockSalesVelocity = Math.floor(Math.random() * 40) + 5; // units sold per month
    const mockRevenue = mockSalesVelocity * price * (Math.floor(Math.random() * 3) + 1); // 1-3 months of revenue

    const product = await Product.create({
      userId: req.user.id,
      title,
      description: description || '',
      price,
      category,
      stock,
      tags: tags || [],
      marketingCaption: marketingCaption || '',
      salesVelocity: mockSalesVelocity,
      revenue: mockRevenue,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id, userId: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Product successfully removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/alerts/low-stock
// @access  Private
const getLowStockAlerts = async (req, res) => {
  try {
    // Find products where stock is less than or equal to 10
    const lowStockProducts = await Product.find({
      userId: req.user.id,
      stock: { $lte: 10 },
    }).sort({ stock: 1 });

    res.json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlerts,
};
