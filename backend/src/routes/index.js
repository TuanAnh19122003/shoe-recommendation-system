const express = require('express');
const router = express.Router();

const roleRoutes = require('./role.route');
const userRoutes = require('./user.route');
const productRoutes = require('./product.route');
const variant = require('./product_variant.route');
const authRoutes = require('./auth.routes');
const cartRouter = require('./cart.route');
const orderRouter = require('./order.routes');
const behaviorRouter = require("./behavior.route");

router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/product-variants', variant);
router.use('/auth', authRoutes);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/behavior', behaviorRouter);

module.exports = router;