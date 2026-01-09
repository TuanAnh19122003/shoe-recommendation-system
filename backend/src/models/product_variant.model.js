const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    size: { type: DataTypes.STRING(50), allowNull: false }, // Đổi sang STRING để linh hoạt (S, M, L, XL)
    color: { type: DataTypes.STRING(50), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
    tableName: 'product_variants',
    underscored: true,
    timestamps: true
});

module.exports = ProductVariant;