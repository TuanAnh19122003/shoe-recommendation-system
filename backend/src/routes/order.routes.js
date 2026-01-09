const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Áp dụng authMiddleware cho tất cả các thao tác đơn hàng
router.use(authMiddleware);

// GET http://localhost:5000/api/orders -> Lấy tất cả đơn hàng (Admin)
router.get('/', orderController.getAllOrders);

// POST http://localhost:5000/api/orders/checkout-cod -> Đặt hàng
router.post('/checkout-cod', orderController.checkoutCOD);

// GET http://localhost:5000/api/orders/my-orders -> Đơn hàng của tôi (User)
router.get('/my-orders', orderController.getMyOrders);

// PUT http://localhost:5000/api/orders/status/:id -> Cập nhật trạng thái
router.put('/status/:id', orderController.updateOrderStatus);

module.exports = router;