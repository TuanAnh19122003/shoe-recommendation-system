const { Order, OrderItem, Cart, CartItem, ProductVariant, User, Product, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');

class OrderService {
    // ==========================================
    // API THỐNG KÊ DASHBOARD (Mới thêm)
    // ==========================================
    // Tìm hàm getDashboardStats trong order.service.js
    static async getDashboardStats() {
        try {
            // 1. Tính doanh thu: Cần đảm bảo lọc đúng status 'delivered'
            const totalRevenue = await Order.sum('total_price', {
                where: { status: 'delivered' }
            });

            // 2. Kiểm tra nếu total_price là string (như "671.34" trong JSON bạn gửi)
            // Đôi khi sum() trả về null nếu không tìm thấy, ta gán mặc định là 0
            const revenueValue = totalRevenue ? parseFloat(totalRevenue) : 0;

            // 3. Các thông số khác
            const totalOrders = await Order.count();
            const totalCustomers = await User.count({ where: { role_id: 2 } });

            const recentOrders = await Order.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name']
                }]
            });

            return {
                revenue: revenueValue, // Trả về con số đã được xử lý
                orders: totalOrders,
                customers: totalCustomers,
                recentOrders
            };
        } catch (error) {
            console.error("Lỗi tại Service:", error);
            throw error;
        }
    }

    // ==========================================
    // THỐNG KÊ DOANH THU THEO THÁNG (Cho biểu đồ)
    // ==========================================
    static async getRevenueByMonth() {
        return await Order.findAll({
            attributes: [
                [fn('MONTH', col('created_at')), 'month'],
                [fn('SUM', col('total_price')), 'total']
            ],
            where: { status: 'completed' },
            group: [fn('MONTH', col('created_at'))],
            order: [[fn('MONTH', col('created_at')), 'ASC']]
        });
    }

    // ==========================================
    // LẤY TẤT CẢ ĐƠN HÀNG (Dành cho Admin)
    // ==========================================
    static async getAllOrdersAdmin(options = {}) {
        const { offset, limit, search, status } = options;
        const whereClause = {};

        if (status && status !== 'all') {
            whereClause.status = status;
        }

        if (search) {
            whereClause[Op.or] = [
                { customer_name: { [Op.like]: `%${search}%` } },
                { phone_number: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: ProductVariant,
                        as: 'variant',
                        attributes: ['size', 'color'],
                        include: [{
                            model: Product,
                            as: 'product',
                            attributes: ['name']
                        }]
                    }]
                }
            ],
            offset: offset ? parseInt(offset) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            order: [['created_at', 'DESC']],
            distinct: true
        };

        return await Order.findAndCountAll(queryOptions);
    }

    // ==========================================
    // TẠO ĐƠN HÀNG COD
    // ==========================================
    static async createOrderCOD(userId, shippingInfo) {
        const { customer_name, phone_number, address } = shippingInfo;
        const t = await sequelize.transaction();

        try {
            const cart = await Cart.findOne({
                where: { user_id: userId },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{ model: ProductVariant, as: 'variant' }]
                }],
                transaction: t
            });

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('Giỏ hàng đang trống');
            }

            let totalAmount = 0;
            for (const item of cart.items) {
                if (!item.variant) throw new Error('Một số sản phẩm không còn tồn tại');
                if (item.variant.stock < item.quantity) {
                    throw new Error(`Sản phẩm size ${item.variant.size} không đủ hàng`);
                }
                totalAmount += parseFloat(item.variant.price) * item.quantity;
            }

            const order = await Order.create({
                user_id: userId,
                total_price: totalAmount,
                customer_name,
                phone_number,
                address,
                payment_method: 'COD',
                status: 'pending'
            }, { transaction: t });

            for (const item of cart.items) {
                await OrderItem.create({
                    order_id: order.id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.variant.price
                }, { transaction: t });

                await item.variant.decrement('stock', { by: item.quantity, transaction: t });
            }

            await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
            await t.commit();
            return order;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = OrderService;