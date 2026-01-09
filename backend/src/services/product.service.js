const Product = require('../models/product.model');
const ProductVariant = require('../models/product_variant.model');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs')

class ProductService {
    static async getAllProductsHome(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const queryOptions = {
            where: whereClause,
            offset,
            limit,
            include: [{
                model: ProductVariant,
                as: 'variants',
                attributes: ['price', 'stock', 'color', 'size']
            }],
            distinct: true,
            order: [['createdAt', 'DESC']]
        };

        const result = await Product.findAndCountAll(queryOptions);

        // Xử lý dữ liệu trả về để Frontend dễ hiển thị
        const processedProducts = result.rows.map(product => {
            const p = product.toJSON();

            // Lấy danh sách giá từ các biến thể
            const prices = p.variants.map(v => parseFloat(v.price));

            return {
                id: p.id,
                name: p.name,
                description: p.description,
                image: p.image,
                slug: p.slug,
                createdAt: p.createdAt,
                // Tính toán thông tin hiển thị
                minPrice: prices.length > 0 ? Math.min(...prices) : 0,
                maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
                totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
                // Lấy danh sách màu sắc duy nhất hiện có
                colors: [...new Set(p.variants.map(v => v.color))]
            };
        });

        return {
            count: result.count,
            rows: processedProducts
        };
    }

    static async getProductBySlug(slug) {
        const product = await Product.findOne({
            where: { slug: slug },
            include: [{
                model: ProductVariant,
                as: 'variants',
                attributes: ['id', 'size', 'color', 'price', 'stock']
            }]
        });

        if (!product) throw new Error('Không tìm thấy sản phẩm');
        return product;
    }

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