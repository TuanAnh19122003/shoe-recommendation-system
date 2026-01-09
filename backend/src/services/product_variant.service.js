const ProductVariant = require('../models/product_variant.model');
const Product = require('../models/product.model');

class ProductVariantService {

    static async getAllVariants(options = {}) {
        const { offset, limit, product_id } = options;

        const whereClause = {};
        if (product_id) {
            whereClause.product_id = product_id;
        }

        const queryOptions = {
            where: whereClause,
            include:{
                model: Product,
                as: 'product',
                attributes: ['id', 'name']
            },
            offset,
            limit,
            order: [['id', 'ASC']]
        };

        return await ProductVariant.findAndCountAll(queryOptions);
    }

    static async getVariantById(id) {
        const variant = await ProductVariant.findByPk(id,{
            include:{
                model: Product,
                as: 'product',
                attributes: ['id', 'name']
            },
        });
        if (!variant) throw new Error('Product variant not found');
        return variant;
    }

    static async createVariant(data) {
        const variant = await ProductVariant.create(data);
        return variant;
    }

    static async updateVariant(id, data) {
        const variant = await ProductVariant.findByPk(id);
        if (!variant) throw new Error('Product variant not found');

        return await variant.update(data);
    }

    static async deleteVariant(id) {
        const variant = await ProductVariant.findByPk(id);
        if (!variant) return 0;

        return await ProductVariant.destroy({ where: { id } });
    }
}

module.exports = ProductVariantService;
