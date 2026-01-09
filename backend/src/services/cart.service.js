const { Cart, CartItem, ProductVariant } = require('../models');

class CartService {
    // ==========================================
    // ADD TO CART (Thêm hoặc cập nhật số lượng)
    // ==========================================
    static async addToCart(userId, variantId, quantity = 1) {
        const t = await Cart.sequelize.transaction();
        try {
            // 1. Tìm hoặc tạo Cart cho User
            // findOrCreate trả về [instance, created]
            const [cart] = await Cart.findOrCreate({
                where: { user_id: userId },
                defaults: { user_id: userId },
                transaction: t
            });

            // 2. Kiểm tra tồn tại của Variant và Stock
            const variant = await ProductVariant.findByPk(variantId, { transaction: t });
            if (!variant) throw new Error('Product variant not found');

            if (variant.stock < quantity) {
                throw new Error('Not enough stock available');
            }

            // 3. Tìm item trong giỏ
            const existingItem = await CartItem.findOne({
                where: {
                    cart_id: cart.id,
                    variant_id: variantId
                },
                transaction: t
            });

            let result;
            if (existingItem) {
                // Kiểm tra tổng số lượng sau khi cộng thêm
                if (variant.stock < (existingItem.quantity + quantity)) {
                    throw new Error('Total quantity exceeds available stock');
                }
                existingItem.quantity += quantity;
                result = await existingItem.save({ transaction: t });
            } else {
                // Lưu ý: CartItem model mới đã bỏ trường 'price' (giá lưu ở OrderItem)
                result = await CartItem.create({
                    cart_id: cart.id,
                    variant_id: variantId,
                    quantity
                }, { transaction: t });
            }

            await t.commit();
            return result;
        } catch (err) {
            await t.rollback();
            console.error('[ADD TO CART ERROR]', err.message);
            throw err;
        }
    }

    // ==========================================
    // GET CART BY USER (Lấy toàn bộ item + thông tin variant)
    // ==========================================
    static async getCartByUserId(userId) {
        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: CartItem,
                    as: 'items', // Phải khớp với alias trong initRelationships
                    include: [
                        {
                            model: ProductVariant,
                            as: 'variant'
                        }
                    ]
                }
            ]
        });

        return cart ? cart.items : [];
    }

    // ==========================================
    // UPDATE QUANTITY (Cập nhật trực tiếp số lượng)
    // ==========================================
    static async updateQuantity(cartItemId, quantity) {
        const item = await CartItem.findByPk(cartItemId, {
            include: [{ model: ProductVariant, as: 'variant' }]
        });

        if (!item) throw new Error('Cart item not found');

        if (quantity <= 0) {
            await item.destroy();
            return { message: 'Item removed from cart' };
        }

        // Kiểm tra kho trước khi update
        if (item.variant && item.variant.stock < quantity) {
            throw new Error('Requested quantity exceeds stock');
        }

        item.quantity = quantity;
        await item.save();
        return item;
    }

    // ==========================================
    // REMOVE ITEM (Xóa 1 dòng item)
    // ==========================================
    static async removeItem(cartItemId) {
        const deleted = await CartItem.destroy({
            where: { id: cartItemId }
        });

        if (!deleted) throw new Error('Cart item not found');
        return { success: true };
    }

    // ==========================================
    // CLEAR CART (Xóa sạch giỏ hàng)
    // ==========================================
    static async clearCart(userId) {
        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) return 0;

        return await CartItem.destroy({
            where: { cart_id: cart.id }
        });
    }
}

module.exports = CartService;