const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 1. ROUTE NÀY PHẢI ĐỂ TRƯỚC MIDDLEWARE (PUBLIC)
// Đây là nơi VNPAY gọi về, không cần check login
router.get('/vnpay-return', orderController.vnpayReturn);

// 2. SAU ĐÓ MỚI ÁP DỤNG authMiddleware cho các route còn lại
router.use(authMiddleware);

// --- ROUTES DÀNH CHO ADMIN (Cần login) ---
router.get('/dashboard/stats', orderController.getAdminDashboardStats);
router.get('/', orderController.getAllOrders);
router.put('/status/:id', orderController.updateOrderStatus);

// --- ROUTES DÀNH CHO USER (Cần login) ---
router.post('/checkout-cod', orderController.checkoutCOD);
// Không cần ghi authMiddleware ở đây nữa vì đã dùng router.use ở trên rồi
router.post('/checkout-vnpay', orderController.checkoutVNPAY); 
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;