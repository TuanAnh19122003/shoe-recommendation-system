const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'checked_out'),
        defaultValue: 'active'
    }
}, {
    tableName: 'carts',
    timestamps: true
});

module.exports = Cart;
