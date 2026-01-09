const OrderService = require('../services/order.service');
const { Order, User } = require('../models');

class OrderController {
    // Lấy tất cả đơn hàng (Cho trang quản lý)
    async getAllOrders(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;
            const status = req.query.status || null;

            let result;

            // Nếu không có phân trang, lấy tất cả theo filter
            if (!page || !pageSize) {
                result = await OrderService.getAllOrdersAdmin({ search, status });
                return res.status(200).json({
                    success: true,
                    message: 'Get all orders successfully',
                    data: result.rows,
                    total: result.count
                });
            }

            // Xử lý phân trang
            const offset = (page - 1) * pageSize;
            result = await OrderService.getAllOrdersAdmin({
                offset,
                limit: pageSize,
                search,
                status
            });

            res.status(200).json({
                success: true,
                message: 'Get all orders successfully',
                data: result.rows,
                total: result.count,
                page,
                pageSize,
                totalPages: Math.ceil(result.count / pageSize)
            });
        } catch (error) {
            console.error('Lỗi getAllOrders:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the order list',
                error: error.message
            });
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