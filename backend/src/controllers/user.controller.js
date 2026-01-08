const UserService = require('../services/user.service');

class UserController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                result = await UserService.getAllUser({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Get all users successfully',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await UserService.getAllUser({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Get all users successfully',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the user list',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await UserService.createUser(req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Create user successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Create user failed',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await UserService.updateUser(req.params.id, req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Update user successfully',
                data
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "Update user failed",
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await UserService.deleteUser(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Not found user to delete'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Delete user successfully'
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "An error occurred while deleting the user",
                error: error.message
            });
        }
    }

}

module.exports = new UserController();