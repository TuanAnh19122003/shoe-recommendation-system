module.exports = (db) => {
    const { Role, User, Product, ProductVariant, Cart, CartItem, Order, OrderItem } = db;

    /**
     * Hàm helper để tạo cấu hình quan hệ đồng nhất
     * @param {string} name - Tên cột khóa ngoại (foreign key)
     * @param {string} alias - Tên định danh quan hệ (as)
     * @param {boolean} allowNull - Cho phép null hay không
     * @param {string} onDelete - Hành động khi xóa (CASCADE, SET NULL,...)
     */
    const config = (name, alias, allowNull = false, onDelete = 'CASCADE') => ({
        foreignKey: name,
        as: alias,
        allowNull: allowNull,
        onDelete: onDelete,
        onUpdate: 'CASCADE'
    });

    // ==========================================
    // 1. ROLE & USER
    // ==========================================
    Role.hasMany(User, config('role_id', 'users', true, 'SET NULL'));
    User.belongsTo(Role, config('role_id', 'role', true, 'SET NULL'));

    // ==========================================
    // 2. PRODUCT & VARIANT
    // ==========================================
    Product.hasMany(ProductVariant, config('product_id', 'variants'));
    ProductVariant.belongsTo(Product, config('product_id', 'product'));

    // ==========================================
    // 3. USER & CART
    // ==========================================
    User.hasOne(Cart, config('user_id', 'cart'));
    Cart.belongsTo(User, config('user_id', 'user'));

    // ==========================================
    // 4. CART & CART_ITEM
    // ==========================================
    Cart.hasMany(CartItem, config('cart_id', 'items'));
    CartItem.belongsTo(Cart, config('cart_id', 'cart'));

    // ==========================================
    // 5. VARIANT & CART_ITEM
    // ==========================================
    ProductVariant.hasMany(CartItem, config('variant_id', 'cart_items'));
    CartItem.belongsTo(ProductVariant, config('variant_id', 'variant'));

    // ==========================================
    // 6. USER & ORDER
    // ==========================================
    User.hasMany(Order, config('user_id', 'orders'));
    Order.belongsTo(User, config('user_id', 'user'));

    // ==========================================
    // 7. ORDER & ORDER_ITEM
    // ==========================================
    Order.hasMany(OrderItem, config('order_id', 'items'));
    OrderItem.belongsTo(Order, config('order_id', 'order'));

    // ==========================================
    // 8. VARIANT & ORDER_ITEM
    // ==========================================
    ProductVariant.hasMany(OrderItem, config('variant_id', 'order_items'));
    OrderItem.belongsTo(ProductVariant, config('variant_id', 'variant'));

    console.log('✔ All relationships initialized successfully');
};