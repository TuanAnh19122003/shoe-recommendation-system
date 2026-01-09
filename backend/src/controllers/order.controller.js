const OrderService = require('../services/order.service');
const { Order, User } = require('../models');

class OrderController {
    // Lấy tất cả đơn hàng (Cho trang quản lý)
    async getAllOrders(req, res) {
        try {
            // Gọi service xử lý phân trang và lọc
            const data = await OrderService.getAllOrdersAdmin(req.query);
            res.status(200).json({
                success: true,
                data: data.orders,
                pagination: {
                    total: data.totalItems,
                    pages: data.totalPages,
                    current: data.currentPage
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy đơn hàng cá nhân
    async getMyOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật trạng thái
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

            order.status = status;
            await order.save();
            res.status(200).json({ success: true, message: 'Cập nhật thành công', data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Đặt hàng COD
    async checkoutCOD(req, res) {
        try {
            const order = await OrderService.createOrderCOD(req.user.id, req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new OrderController();