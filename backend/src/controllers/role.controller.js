const RoleService = require('../services/role.service');

class RoleController {
    async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json({
                success: true,
                message: 'Roles fetched successfully',
                data: roles
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch roles',
                error: error.message
            });
        }
    }

    async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = await RoleService.getRoleById(id);
            res.status(200).json({
                success: true,
                message: 'Role fetched successfully',
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch role',
                error: error.message
            });
        }
    }

    async createRole(req, res) {
        try {
            const data = req.body;
            const role = await RoleService.createRole(data);
            res.status(201).json({
                success: true,
                message: 'Role created successfully',
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create role',
                error: error.message
            });
        }
    }

    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const role = await RoleService.updateRole(id, data);
            res.status(200).json({
                success: true,
                message: 'Role updated successfully',
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update role',
                error: error.message
            });
        }
    }

    async deleteRole(req, res) {
        try {
            const { id } = req.params;
            await RoleService.deleteRole(id);
            res.status(200).json({
                success: true,
                message: 'Role deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete role',
                error: error.message
            });
        }
    }
}

module.exports = new RoleController();