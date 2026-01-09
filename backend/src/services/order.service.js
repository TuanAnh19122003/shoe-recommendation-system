const { Order, OrderItem, Cart, CartItem, ProductVariant, User, Product, sequelize } = require('../models');

class OrderService {
    // ==========================================
    // LẤY TẤT CẢ ĐƠN HÀNG (Dành cho Admin)
    // ==========================================
    static async getAllOrdersAdmin(options = {}) {
        const { offset, limit, search, status } = options;

        const whereClause = {};

        // Lọc theo trạng thái đơn hàng
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        // Tìm kiếm theo tên khách hàng, số điện thoại hoặc email (giống logic user)
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
            distinct: true // Rất quan trọng khi dùng findAndCountAll kèm với include (HasMany)
        };

        // Trả về { count, rows } trực tiếp giống UserService
        const orders = await Order.findAndCountAll(queryOptions);
        return orders;
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