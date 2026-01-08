const sequelize = require('../config/database');
const Role = require('./role.model');
const User = require('./user.model');
const Product = require('./product.model');
const ProductVariant = require('./product_variant.model');
const Cart = require('./cart.model');
const CartItem = require('./cart_item.model');
const Order = require('./order.model');
const OrderItem = require('./order_item.model');

const db = {
    Role,
    User,
    Product,
    ProductVariant,
    Cart,
    CartItem,
    Order,
    OrderItem,
    sequelize
}

require('./initRelationships')(db);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;