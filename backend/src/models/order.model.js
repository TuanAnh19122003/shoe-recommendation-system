// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    // Thông tin giao hàng
    customer_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    // Thanh toán
    payment_method: {
        type: DataTypes.ENUM('COD', 'VNPAY'), // Thêm VNPAY
        defaultValue: 'COD'
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'orders',
    underscored: true,
    timestamps: true
});

module.exports = Order;