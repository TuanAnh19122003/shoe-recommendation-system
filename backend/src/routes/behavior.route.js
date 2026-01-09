// routes/behavior.route.js
const express = require('express');
const router = express.Router();
const behaviorController = require('../controllers/userBehavior.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 1. Ghi nhận hành vi (Dùng cho mọi khách hàng)
router.post('/track', behaviorController.track);

// 2. Lấy gợi ý cho trang chi tiết sản phẩm (Public API)
router.get('/recommendations/:variantId', behaviorController.getRecommendedProducts);

module.exports = router;