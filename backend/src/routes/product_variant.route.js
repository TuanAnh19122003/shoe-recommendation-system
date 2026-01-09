const express = require('express');
const router = express.Router();

const controller = require('../controllers/product_variant.controller');

router.get('/', controller.getAllVariants);          // ?product_id=
router.get('/:id', controller.getVariantById);
router.post('/', controller.createVariant);
router.put('/:id', controller.updateVariant);
router.delete('/:id', controller.deleteVariant);

module.exports = router;
