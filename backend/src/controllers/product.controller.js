const ProductService = require('../services/product.service');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                result = await ProductService.getAllProduct({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Get all products successfully',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ProductService.getAllProduct({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Get all products successfully',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the product list',
                error: error.message
            });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Get product by id successfully',
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the product',
                error: error.message
            });
        }
    }

    async createProduct(req, res) {
        try {
            const data = await ProductService.createProduct(req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Create product successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Create product failed',
                error: error.message
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const data = await ProductService.updateProduct(req.params.id, req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Update product successfully',
                data
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "Update product failed",
                error: error.message
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await ProductService.deleteProduct(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Not found product to delete'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Delete product successfully'
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "An error occurred while deleting the product",
                error: error.message
            });
        }
    }

    async getHomeProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = 8; // Mặc định 8 sản phẩm mỗi trang cho đẹp
            const offset = (page - 1) * pageSize;

            const result = await ProductService.getAllProductsHome({
                offset,
                limit: pageSize,
                search: req.query.search
            });

            res.status(200).json({
                success: true,
                data: result.rows,
                total: result.count
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getProductBySlug(req, res) {
        try {
            const { slug } = req.params;
            const product = await ProductService.getProductBySlug(slug);

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();