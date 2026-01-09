const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'orders',
    underscored: true,
    timestamps: true
});

module.exports = Order;