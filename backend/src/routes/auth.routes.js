const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../utils/multer');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.put('/profile', authMiddleware, upload.single('image'), AuthController.updateProfile);

module.exports = router;
