const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'order_items',
    underscored: true,
    timestamps: true
});

module.exports = OrderItem;