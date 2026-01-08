module.exports = (db) => {
    const {
        Role,
        User,
        Product,
        ProductVariant,
        Cart,
        CartItem,
        Order,
        OrderItem
    } = db;

    const fk = (
        name,
        allowNull = false,
        onDelete = 'CASCADE',
        onUpdate = 'CASCADE'
    ) => ({
        foreignKey: { name, allowNull },
        constraints: true,
        onDelete,
        onUpdate
    });

    // ===== Role ↔ User =====
    Role.hasMany(User, { ...fk('roleId'), as: 'users' });
    User.belongsTo(Role, { ...fk('roleId', true, 'SET NULL'), as: 'role' });

    // ===== Product ↔ ProductVariant =====
    Product.hasMany(ProductVariant, { ...fk('product_id'), as: 'variants' });
    ProductVariant.belongsTo(Product, { ...fk('product_id'), as: 'product' });

    // ===== User ↔ Cart =====
    User.hasMany(Cart, { ...fk('user_id'), as: 'carts' });
    Cart.belongsTo(User, { ...fk('user_id'), as: 'user' });

    // ===== Cart ↔ CartItem =====
    Cart.hasMany(CartItem, {
        ...fk('cart_id'),
        as: 'items',
        hooks: true
    });
    CartItem.belongsTo(Cart, { ...fk('cart_id'), as: 'cart' });

    // ===== ProductVariant ↔ CartItem =====
    ProductVariant.hasMany(CartItem, {
        ...fk('variant_id'),
        as: 'cartItems'
    });
    CartItem.belongsTo(ProductVariant, {
        ...fk('variant_id'),
        as: 'variant'
    });

    // ===== User ↔ Order =====
    User.hasMany(Order, { ...fk('user_id'), as: 'orders' });
    Order.belongsTo(User, { ...fk('user_id'), as: 'user' });

    // ===== Order ↔ OrderItem =====
    Order.hasMany(OrderItem, {
        ...fk('order_id'),
        as: 'items',
        hooks: true
    });
    OrderItem.belongsTo(Order, { ...fk('order_id'), as: 'order' });

    // ===== ProductVariant ↔ OrderItem =====
    ProductVariant.hasMany(OrderItem, {
        ...fk('variant_id'),
        as: 'orderItems'
    });
    OrderItem.belongsTo(ProductVariant, {
        ...fk('variant_id'),
        as: 'variant'
    });

    console.log('All relationships initialized successfully.');
};
