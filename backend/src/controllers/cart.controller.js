const CartService = require('../services/cart.service');

class CartController {

    // =========================
    // ADD TO CART
    // =========================
    async addToCart(req, res) {
        try {
            const userId = req.user.id; // 👈 lấy từ middleware auth
            const { variant_id, quantity } = req.body;

            if (!variant_id) {
                return res.status(400).json({
                    success: false,
                    message: 'variant_id is required'
                });
            }

            const data = await CartService.addToCart(
                userId,
                variant_id,
                quantity || 1
            );

            res.status(200).json({
                success: true,
                message: 'Add to cart successfully',
                data
            });
        } catch (error) {
            console.error('[ADD TO CART]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // GET CART
    // =========================
    async getMyCart(req, res) {
        try {
            const userId = req.user.id;

            const items = await CartService.getCartByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'Get cart successfully',
                data: items
            });
        } catch (error) {
            console.error('[GET CART]', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    async updateQuantity(req, res) {
        try {
            const { quantity } = req.body;

            const item = await CartService.updateQuantity(
                req.params.id,
                quantity
            );

            res.status(200).json({
                success: true,
                message: 'Update cart item successfully',
                data: item
            });
        } catch (error) {
            console.error('[UPDATE CART]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // REMOVE ITEM
    // =========================
    async removeItem(req, res) {
        try {
            await CartService.removeItem(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Remove cart item successfully'
            });
        } catch (error) {
            console.error('[REMOVE CART ITEM]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // CLEAR CART
    // =========================
    async clearCart(req, res) {
        try {
            const userId = req.user.id;

            await CartService.clearCart(userId);

            res.status(200).json({
                success: true,
                message: 'Clear cart successfully'
            });
        } catch (error) {
            console.error('[CLEAR CART]', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CartController();
