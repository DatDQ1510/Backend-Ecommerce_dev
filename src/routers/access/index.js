'use strict'
const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');
// sign - up
router.post('/sign-up', asyncHandler(accessController.signUp));
// log - in
router.post('/log-in', asyncHandler(accessController.logIn));

// authentication
router.use(authentication)

// log - out
router.post('/log-out', asyncHandler(accessController.logOut));
module.exports = router;