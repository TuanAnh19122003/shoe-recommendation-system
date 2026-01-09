const hashPassword = require('../utils/hash');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const path = require('path');
const fs = require('fs');

class UserService {
    static async getAllUser(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { lastname: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            },
            offset,
            limit,
            order: [['createdAt', 'ASC']]
        };

        const users = await User.findAndCountAll(queryOptions);
        return users;
    }

    static async getUserById(id) {
        const user = await User.findByPk(id, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }
        });
        return user;
    }

    static async createUser(data, file) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const user = await User.create(data);
        return user;
    }

    static async updateUser(id, data, file) {
        const user = await User.findOne({ where: { id: id } });
        if (!user) throw new Error('User không tồn tại');

        if (data.password && data.password !== user.password) {
            data.password = await hashPassword(data.password);
        } else {
            delete data.password;
        }
        if (file) {
            if (user.image) {
                const oldImagePath = path.join(__dirname, '..', user.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        return await user.update(data)
    }

    static async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) return 0;

        if (user.image) {
            const imagePath = path.join(__dirname, '..', user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return await User.destroy({ where: { id } });
    }

}

module.exports = UserService;