const OrderService = require('../services/order.service');
const { Order, User, OrderItem, ProductVariant, Product } = require('../models');

class OrderController {
    // ==========================================
    // MỚI: Lấy thống kê cho Dashboard Admin
    // ==========================================
    async getAdminDashboardStats(req, res) {
        try {
            // Gọi service đã viết để lấy tổng hợp dữ liệu
            const stats = await OrderService.getDashboardStats();

            res.status(200).json({
                success: true,
                message: 'Lấy thống kê dashboard thành công',
                data: stats
            });
        } catch (error) {
            console.error('Lỗi getAdminDashboardStats:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy dữ liệu thống kê',
                error: error.message
            });
        }
    }

    // Lấy tất cả đơn hàng (Cho trang quản lý)
    async getAllOrders(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;
            const status = req.query.status || null;

            let result;

            if (!page || !pageSize) {
                result = await OrderService.getAllOrdersAdmin({ search, status });
                return res.status(200).json({
                    success: true,
                    message: 'Get all orders successfully',
                    data: result.rows,
                    total: result.count
                });
            }

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

    // Lấy đơn hàng cá nhân (Dành cho trang My Orders của khách)
    async getMyOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { user_id: userId },
                include: [{
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: ProductVariant,
                        as: 'variant',
                        include: [{ model: Product, as: 'product' }]
                    }]
                }],
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật trạng thái đơn hàng (Admin duyệt đơn)
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

    // Đặt hàng COD (Khách thanh toán)
    async checkoutCOD(req, res) {
        try {
            const order = await OrderService.createOrderCOD(req.user.id, req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async checkoutVNPAY(req, res) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const result = await OrderService.createOrderVNPAY(req.user.id, req.body, ipAddress);
            res.status(200).json({ success: true, paymentUrl: result.paymentUrl });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async vnpayReturn(req, res) {
        try {
            const result = await OrderService.verifyVNPAYReturn(req.query);

            // Sau khi xử lý DB xong, đẩy trình duyệt về lại React
            if (result.success) {
                return res.redirect(`http://localhost:5173/payment-result?status=success&orderId=${result.orderId}`);
            } else {
                // Trường hợp thất bại hoặc hủy
                return res.redirect(`http://localhost:5173/payment-result?status=error&orderId=${result.orderId || ''}`);
            }
        } catch (error) {
            console.error("VNPAY Error:", error);
            return res.redirect(`http://localhost:5173/payment-result?status=error`);
        }
    }
}

module.exports = new OrderController();