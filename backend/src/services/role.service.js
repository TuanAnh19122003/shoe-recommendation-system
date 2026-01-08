const Role = require('../models/role.model');

class RoleService {
    static async getAllRoles() {
        const roles = await Role.findAll();
        return roles;
    }
    static async getRoleById(id) {
        const role = await Role.findByPk(id);
        if(!role) {
            throw new Error('Role not found');
        }
        return role;
    }

    static async createRole(roleData) {
        const role = await Role.create(roleData);
        return role;
    }

    static async updateRole(id, roleData) {
        const role = await Role.findByPk(id);
        if(!role) throw new Error('Role not found');
        await role.update(roleData);
        return role;
    }

    static async deleteRole(id) {
        const role = await Role.findByPk(id);
        if(!role) throw new Error('Role not found');
        await role.destroy();
        return;
    }

}

module.exports = RoleService;