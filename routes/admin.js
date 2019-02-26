const path = require('path');
const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');


router.get('/add-product',productsController.getAddProduct);
router.post('/product',productsController.postAddProduct);

module.exports = router;
