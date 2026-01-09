const ProductVariantService = require('../services/product_variant.service');

class ProductVariantController {

    async getAllVariants(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const product_id = req.query.product_id || null;

            let result;

            if (!page || !pageSize) {
                result = await ProductVariantService.getAllVariants({ product_id });
                return res.status(200).json({
                    success: true,
                    message: 'Get all product variants successfully',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ProductVariantService.getAllVariants({
                offset,
                limit: pageSize,
                product_id
            });

            res.status(200).json({
                success: true,
                message: 'Get all product variants successfully',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching product variants',
                error: error.message
            });
        }
    }

    async getVariantById(req, res) {
        try {
            const variant = await ProductVariantService.getVariantById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Get product variant successfully',
                data: variant
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the product variant',
                error: error.message
            });
        }
    }

    async createVariant(req, res) {
        try {
            const data = await ProductVariantService.createVariant(req.body);
            res.status(200).json({
                success: true,
                message: 'Create product variant successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Create product variant failed',
                error: error.message
            });
        }
    }

    async updateVariant(req, res) {
        try {
            const data = await ProductVariantService.updateVariant(
                req.params.id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: 'Update product variant successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Update product variant failed',
                error: error.message
            });
        }
    }

    async deleteVariant(req, res) {
        try {
            const deletedCount = await ProductVariantService.deleteVariant(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product variant not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Delete product variant successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting product variant',
                error: error.message
            });
        }
    }
}

module.exports = new ProductVariantController();
