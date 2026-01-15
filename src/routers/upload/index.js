'use strict'
const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/upload.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');


router.use(authentication)
const { uploadMemory, uploadDisk } = require('../../config/muler.config.js');

router.post('/', asyncHandler(UploadController.upLoadFromUrl));
router.post('/thumb', uploadDisk.single("file"), asyncHandler(UploadController.upLoadFromLocal));
router.post('/many', uploadDisk.array("files", 3), asyncHandler(UploadController.upLoadManyFromLocal));


module.exports = router;