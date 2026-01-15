'use strict'
const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/notification.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');


router.use(authentication)


router.get('/listNotification', asyncHandler(NotificationController.listNotiByUser));

module.exports = router;