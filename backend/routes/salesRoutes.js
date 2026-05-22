const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getSalesSuggestions,
} = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/analytics', protect, getDashboardAnalytics);
router.get('/suggestions', protect, getSalesSuggestions);

module.exports = router;
