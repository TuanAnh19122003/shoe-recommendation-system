const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }
}, {
    tableName: 'carts',
    underscored: true,
    timestamps: true
});

module.exports = Cart;