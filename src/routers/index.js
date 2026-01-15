'use strict'
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth.js');
const router = express.Router();
const { pustToLogDiscord } = require('../middlewares/index.js');

// add log to discord
router.use(pustToLogDiscord)
// check apiKey
router.use(apiKey)
// check permissions
router.use(permission('0000'))

router.use('/v1/api/product', require('./product/index.js'));
router.use('/v1/api', require('./access/index.js'));
router.use('/v1/api/discount', require('./discount/index.js'));
router.use('/v1/api/comment', require('./comment/index.js'));
router.use('/v1/api/notification', require('./notification/index.js'));
router.use('/v1/api/upload', require('./upload/index.js'));
module.exports = router; 