const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const UserBehavior = sequelize.define('UserBehavior', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER,
    action: DataTypes.ENUM('view', 'add_to_cart', 'purchase')
}, {
    tableName: 'user_behavior',
    timestamps: true,
    underscored: true
});

module.exports = UserBehavior;
