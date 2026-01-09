const { Order, OrderItem, Cart, CartItem, ProductVariant, User, Product, sequelize } = require('../models');

class OrderService {
    // ==========================================
    // LẤY TẤT CẢ ĐƠN HÀNG (Dành cho Admin)
    // ==========================================
    static async getAllOrdersAdmin(query) {
        const { status, page = 1, limit = 10 } = query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (status) whereClause.status = status;

        const { count, rows } = await Order.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user', // Khớp với config('user_id', 'user') trong file bạn gửi
                    attributes: ['first_name', 'last_name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items', // Khớp với config('order_id', 'items')
                    include: [{
                        model: ProductVariant,
                        as: 'variant', // Khớp với config('variant_id', 'variant')
                        attributes: ['size', 'color'],
                        include: [{ 
                            model: Product, 
                            as: 'product', // Khớp với config('product_id', 'product')
                            attributes: ['name'] 
                        }]
                    }]
                }
            ],
            distinct: true 
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            orders: rows
        };
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
            // Tính toán và kiểm tra kho
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

            // Lưu Item vào Order và trừ Stock
            for (const item of cart.items) {
                await OrderItem.create({
                    order_id: order.id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.variant.price
                }, { transaction: t });

                await item.variant.decrement('stock', { by: item.quantity, transaction: t });
            }

            // Xóa giỏ hàng
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