'use strict'
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth.js');
const router = express.Router();

// check apiKey
router.use(apiKey)
// check permissions
router.use(permission('0000'))

router.use('/v1/api/product', require('./product/index.js'));
router.use('/v1/api', require('./access/index.js'));
router.use('/v1/api/discount', require('./discount/index.js'));
module.exports = router; 