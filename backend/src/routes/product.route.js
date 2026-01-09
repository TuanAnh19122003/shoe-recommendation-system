const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const controller = require('../controllers/product.controller');

router.get('/variants', controller.getHomeProducts);
router.get('/detail/:slug', controller.getProductBySlug);

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.post('/', upload.single('image'), controller.createProduct);
router.put('/:id', upload.single('image'), controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;