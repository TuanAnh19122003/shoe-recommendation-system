const { Order, OrderItem, Cart, CartItem, ProductVariant, User, Product, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');
const moment = require('moment');
const crypto = require('crypto');
const queryString = require('qs');

// Hàm hỗ trợ sắp xếp và encode theo đúng chuẩn mẫu VNPAY
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

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

    // ==========================================
    // TẠO ĐƠN HÀNG VNPAY
    // ==========================================
    static async createOrderVNPAY(userId, shippingInfo, ipAddress) {
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

            if (!cart || cart.items.length === 0) throw new Error('Giỏ hàng trống');

            let totalAmount = 0;
            for (const item of cart.items) {
                if (item.variant.stock < item.quantity) {
                    throw new Error(`Sản phẩm ${item.variant.size} không đủ hàng`);
                }
                totalAmount += parseFloat(item.variant.price) * item.quantity;
            }

            const order = await Order.create({
                user_id: userId,
                total_price: totalAmount,
                customer_name,
                phone_number,
                address,
                payment_method: 'VNPAY',
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

            // CẤU CẤU HÌNH VNPAY
            process.env.TZ = 'Asia/Ho_Chi_Minh';
            const createDate = moment().format('YYYYMMDDHHmmss');
            const tmnCode = process.env.VNP_TMNCODE;
            const secretKey = process.env.VNP_HASHSECRET;
            const vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURNURL;

            let vnp_Params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'pay',
                'vnp_TmnCode': tmnCode,
                'vnp_Locale': 'vn',
                'vnp_CurrCode': 'VND',
                'vnp_TxnRef': order.id.toString(),
                'vnp_OrderInfo': 'Thanh toan cho ma GD:' + order.id,
                'vnp_OrderType': 'other',
                'vnp_Amount': Math.round(totalAmount * 1000 * 100),
                'vnp_ReturnUrl': returnUrl,
                'vnp_IpAddr': ipAddress === '::1' ? '127.0.0.1' : ipAddress,
                'vnp_CreateDate': createDate
            };

            vnp_Params = sortObject(vnp_Params);
            const signData = queryString.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = vnpUrl + '?' + queryString.stringify(vnp_Params, { encode: false });
            return { paymentUrl };

        } catch (error) {
            if (t) await t.rollback();
            throw error;
        }
    }

    // XÁC MINH VNPAY RETURN
    static async verifyVNPAYReturn(queryParams) {
        let vnp_Params = { ...queryParams };
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASHSECRET;
        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const orderId = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];

        if (secureHash === signed) {
            if (responseCode === '00') {
                await Order.update({ status: 'confirmed' }, { where: { id: orderId } });
                return { success: true, orderId };
            }
            // Nếu thanh toán thất bại (người dùng hủy), nên hoàn lại kho (stock) nếu cần ở đây
            return { success: false, orderId, code: responseCode };
        } else {
            return { success: false, reason: "Invalid Signature" };
        }
    }
}

module.exports = OrderService;