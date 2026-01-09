const sequelize = require('../config/database');
const Role = require('./role.model');
const User = require('./user.model');
const Product = require('./product.model');
const ProductVariant = require('./product_variant.model'); // Kiểm tra lại tên file có dấu _ không
const Cart = require('./cart.model');
const CartItem = require('./cart_item.model');
const Order = require('./order.model');
const OrderItem = require('./order_item.model');
const UserBehavior = require('./userBehavior.model');
const initRelationships = require('./initRelationships');

const db = {
    Role,
    User,
    Product,
    ProductVariant,
    Cart,
    CartItem,
    Order,
    OrderItem,
    UserBehavior,
    sequelize
};

// Khởi tạo các quan hệ
initRelationships(db);

// Sync database
sequelize.sync({ alter: true })
    .then(() => console.log('✔ Database synced successfully'))
    .catch((error) => console.error('Sequelize sync error:', error));

module.exports = db;