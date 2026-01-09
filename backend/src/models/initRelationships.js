module.exports = (db) => {
    const { Role, User, Product, ProductVariant, Cart, CartItem, Order, OrderItem, UserBehavior } = db;

    const fk = (name, allowNull = false, onDelete = 'CASCADE') => ({
        foreignKey: { name, allowNull },
        onDelete,
        onUpdate: 'CASCADE'
    });

    // Relationships
    Role.hasMany(User, fk('role_id', true, 'SET NULL'), { as: 'users' });
    User.belongsTo(Role, fk('role_id', true, 'SET NULL'), { as: 'role' });

    Product.hasMany(ProductVariant, fk('product_id'), { as: 'variants' });
    ProductVariant.belongsTo(Product, fk('product_id'), { as: 'product' });

    User.hasOne(Cart, fk('user_id'), { as: 'cart' });
    Cart.belongsTo(User, fk('user_id'), { as: 'user' });

    Cart.hasMany(CartItem, fk('cart_id'), { as: 'items' });
    CartItem.belongsTo(Cart, fk('cart_id'), { as: 'cart' });

    ProductVariant.hasMany(CartItem, fk('variant_id'), { as: 'cart_items' });
    CartItem.belongsTo(ProductVariant, fk('variant_id'), { as: 'variant' });

    User.hasMany(Order, fk('user_id'), { as: 'orders' });
    Order.belongsTo(User, fk('user_id'), { as: 'user' });

    Order.hasMany(OrderItem, fk('order_id'), { as: 'items' });
    OrderItem.belongsTo(Order, fk('order_id'), { as: 'order' });

    ProductVariant.hasMany(OrderItem, fk('variant_id'), { as: 'order_items' });
    OrderItem.belongsTo(ProductVariant, fk('variant_id'), { as: 'variant' });

    console.log('✔ All relationships initialized successfully');
};