const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cart_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, validate: { min: 1 } }
}, {
    tableName: 'cart_items',
    underscored: true,
    timestamps: true
});

module.exports = CartItem;