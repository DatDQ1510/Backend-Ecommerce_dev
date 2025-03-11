'use strict'
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('/find-all-product', asyncHandler(productController.findAllProducts));
router.get('/find-product/:id', asyncHandler(productController.findProduct));
// authentication

router.use(authentication)

// create product
router.post('/', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unpublish/:id', asyncHandler(productController.unpublishProduct));
// end create product

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/publishs/all', asyncHandler(productController.getAllPublishsForShop));
// end query
module.exports = router; 