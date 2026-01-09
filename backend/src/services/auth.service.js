const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const path = require('path');
const fs = require('fs');
const { hashPassword, checkPassword } = require('../utils/hash');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class AuthService {
    // ================= LOGIN =================
    static async login(email, password) {
        const user = await User.findOne({
            where: { email },
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name', 'code']
            }
        });

        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        if (!user.is_active) {
            throw new Error('Tài khoản đã bị khóa');
        }

        const isMatch = await checkPassword(password, user.password);
        if (!isMatch) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        // 👉 JWT chỉ cần user.id (đúng với authMiddleware)
        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                firstname: user.first_name,
                lastname: user.last_name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        };
    }

    // ================= REGISTER =================
    static async register({ firstname, lastname, email, password, image }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            image,
            password: hashedPassword,
            roleId: 2,        // USER
            is_active: true
        });

        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };
    }

    static async updateProfile(id, data, file) {
        // 1. Tìm user hiện tại
        const user = await User.findOne({
            where: { id },
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name', 'code']
            }
        });

        if (!user) throw new Error('Người dùng không tồn tại');

        // --- Xử lý đổi mật khẩu ---
        if (data.newPassword) {
            if (!data.oldPassword) throw new Error('Vui lòng nhập mật khẩu cũ');
            const isMatch = await checkPassword(data.oldPassword, user.password);
            if (!isMatch) throw new Error('Mật khẩu cũ không chính xác');
            data.password = await hashPassword(data.newPassword);
        } else {
            delete data.password;
        }

        // --- Xử lý hình ảnh ---
        if (file) {
            if (user.image) {
                const oldImagePath = path.join(__dirname, '..', user.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            data.image = `uploads/${file.filename}`;
        }

        // --- Cập nhật database ---
        // Ánh xạ lại tên cột nếu data gửi lên từ frontend là firstname/lastname
        const updatePayload = {
            first_name: data.firstname || user.first_name,
            last_name: data.lastname || user.last_name,
            image: data.image || user.image,
            ...(data.password && { password: data.password })
        };

        await user.update(updatePayload);

        // 👉 QUAN TRỌNG: Load lại dữ liệu mới nhất kèm Role
        await user.reload({
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name', 'code']
            }
        });

        return {
            id: user.id,
            firstname: user.first_name,
            lastname: user.last_name,
            email: user.email,
            image: user.image,
            role: user.role // Bây giờ role đã chắc chắn tồn tại
        };
    }
}

module.exports = AuthService;
