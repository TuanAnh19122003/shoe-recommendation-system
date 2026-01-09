const { UserBehavior, ProductVariant, Product } = require('../models');
const { fn, col, Op } = require('sequelize');

class UserBehaviorService {
    // 1. Lưu hành động (Đảm bảo userId lấy từ localStorage gửi lên)
    static async trackAction({ userId, variantId, action }) {
        return await UserBehavior.create({
            user_id: userId,
            variant_id: variantId,
            action: action
        });
    }

    // 2. Logic gợi ý: "Người dùng đã xem sản phẩm này cũng xem..."
    static async getRecommendations(variantId) {
        // Bước A: Tìm tập hợp User ID đã tương tác với variantId này
        // Chúng ta lấy cả 'view' để danh sách gợi ý luôn dồi dào
        const users = await UserBehavior.findAll({
            where: {
                variant_id: variantId,
                user_id: { [Op.ne]: null }, // Chỉ tính những người đã đăng nhập như Đức
                action: ['view', 'add_to_cart', 'purchase']
            },
            attributes: ['user_id'],
            raw: true
        });

        // Lọc trùng ID
        const userIds = [...new Set(users.map(u => u.user_id))];

        // Nếu chưa có ai xem (hoặc chỉ có mỗi mình Đức xem lần đầu), trả về mảng rỗng
        if (userIds.length === 0) return [];

        // Bước B: Tìm các variant KHÁC mà tập User trên đã từng tương tác
        return await UserBehavior.findAll({
            where: {
                user_id: { [Op.in]: userIds },
                variant_id: { [Op.ne]: variantId }, // Loại bỏ chính sản phẩm đang xem
                action: ['view', 'add_to_cart', 'purchase']
            },
            attributes: [
                'variant_id',
                [fn('COUNT', col('UserBehavior.id')), 'score'] // Tính điểm dựa trên số lượt tương tác
            ],
            include: [{
                model: ProductVariant,
                as: 'variant', // Khớp với Alias config('variant_id', 'variant')
                include: [{
                    model: Product,
                    as: 'product', // Khớp với Alias config('product_id', 'product')
                    attributes: ['name', 'image', 'slug']
                }]
            }],
            // Group by để tính điểm score chính xác
            group: ['variant_id', 'variant.id', 'variant.product.id'],
            order: [[fn('COUNT', col('UserBehavior.id')), 'DESC']],
            limit: 4 // Lấy 4 sản phẩm liên quan nhất
        });
    }
}

module.exports = UserBehaviorService;