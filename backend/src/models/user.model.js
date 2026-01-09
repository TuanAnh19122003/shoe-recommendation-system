const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    role_id: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true
});

module.exports = User;