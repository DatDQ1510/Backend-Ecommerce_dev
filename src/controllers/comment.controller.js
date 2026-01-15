'use strict'

const { SuccessResponse } = require('../core/success.response');

const { createComment, getCommentList, getCommentsByParentId, deleteComment } = require('../services/comment.service.js');

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment successfully',
            metadata: await createComment(req.body)
        }).send(res)
    }
    getCommentList = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list comment successfully',
            metadata: await getCommentList(req.query)
        }).send(res)
    }
    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'get comment by parent id successfully',
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete comment successfully',
            metadata: await deleteComment(req.body)
        }).send(res)
    }

}

module.exports = new CommentController();