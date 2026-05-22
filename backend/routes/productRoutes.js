const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlerts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Route for low stock alert comes first to avoid matching as ID parameter
router.get('/alerts/low-stock', protect, getLowStockAlerts);

router.route('/')
  .get(protect, getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
