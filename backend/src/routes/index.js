const express = require('express');
const router = express.Router();

const roleRoutes = require('./role.route');
const userRoutes = require('./user.route');

router.use('/roles', roleRoutes);
router.use('/users', userRoutes);

module.exports = router;