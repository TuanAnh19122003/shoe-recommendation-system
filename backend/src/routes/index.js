const express = require('express');
const router = express.Router();

const roleRoutes = require('./role.route');
const userRoutes = require('./user.route');
const productRoutes = require('./product.route');

router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;