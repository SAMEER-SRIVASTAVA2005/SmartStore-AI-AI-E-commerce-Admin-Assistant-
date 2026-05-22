const express = require('express');
const router = express.Router();
const { generateProductAIContent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateProductAIContent);

module.exports = router;
