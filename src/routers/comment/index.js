'use strict'
const express = require('express');
const router = express.Router();
const CommentController = require('../../controllers/comment.controller.js');
const { asyncHandler } = require('../../auth/checkAuth.js');
const { authentication } = require('../../auth/authUtils.js');


router.use(authentication)

router.post('/', asyncHandler(CommentController.createComment));
router.get('/listcomment', asyncHandler(CommentController.getCommentList));
router.get('/', asyncHandler(CommentController.getCommentsByParentId));
router.post('/deleteComment', asyncHandler(CommentController.deleteComment))
module.exports = router;