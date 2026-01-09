const UserBehaviorService = require('../services/userBehavior.service');

class UserBehaviorController {
    async track(req, res) {
        try {
            const { variant_id, action, userId } = req.body; // userId từ localStorage gửi lên
            await UserBehaviorService.trackAction({
                userId: userId || null,
                variantId: variant_id,
                action
            });
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRecommendedProducts(req, res) {
        try {
            const { variantId } = req.params;
            const recommendations = await UserBehaviorService.getRecommendations(variantId);
            res.status(200).json({ success: true, data: recommendations });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new UserBehaviorController();