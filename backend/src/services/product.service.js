const Product = require('../models/product.model');
const path = require('path');
const fs = require('fs')

class ProductService {
    static async getAllProduct(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            offset,
            limit,
            order: [['createdAt', 'ASC']]
        };

        const products = await Product.findAndCountAll(queryOptions);
        return products;
    }

    static async getProductById(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    static async createProduct(data, file) {
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const product = await Product.create(data);
        return product;
    }

    static async updateProduct(id, data, file) {
        const product = await Product.findOne({ where: { id: id } });
        if (!product) throw new Error("Product không tồn tại");

        if (file) {
            if (product.image) {
                const oldImagePath = path.join(__dirname, '..', product.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        return await product.update(data);
    }

    static async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) return 0;

        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return await Product.destroy({ where: { id } });
    }
}

module.exports = ProductService;