const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy user từ DB (đảm bảo user còn tồn tại)
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Gắn user vào request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role?.code
        };

        next();
    } catch (error) {
        console.error('[AUTH ERROR]', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
