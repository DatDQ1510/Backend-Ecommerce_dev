'use strict'
const express = require('express');
const router = express.Router();
const DiscountController = require('../../controllers/discount.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');

// authentication

router.use(authentication)

// create product
router.post('/', asyncHandler(DiscountController.createDiscountCode));

// end create product

// query

// end query
module.exports = router; 