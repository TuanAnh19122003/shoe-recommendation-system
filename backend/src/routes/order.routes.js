const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Áp dụng authMiddleware cho tất cả các thao tác đơn hàng
router.use(authMiddleware);

// --- ROUTES DÀNH CHO ADMIN ---

// GET http://localhost:5000/api/orders/dashboard/stats -> Lấy thống kê Dashboard
router.get('/dashboard/stats', orderController.getAdminDashboardStats);

// GET http://localhost:5000/api/orders -> Lấy tất cả đơn hàng (Quản lý đơn hàng)
router.get('/', orderController.getAllOrders);

// PUT http://localhost:5000/api/orders/status/:id -> Cập nhật trạng thái
router.put('/status/:id', orderController.updateOrderStatus);


// --- ROUTES DÀNH CHO USER ---

// POST http://localhost:5000/api/orders/checkout-cod -> Đặt hàng
router.post('/checkout-cod', orderController.checkoutCOD);

// GET http://localhost:5000/api/orders/my-orders -> Đơn hàng của tôi
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;