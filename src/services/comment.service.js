'use strict'

const e = require('express');
const Comment = require('../models/comment.model.js');
const convertToObjectID = require('../utils/index.js').convertToObjectId;
const { NotFoundError } = require('../core/error.response.js');

/*
    key features of comment service:
    + add comment [user, shop]
    + get a list comment [user, shop]
    + delete a comment [user, shop, Admin]
*/

class CommentService {
    static async createComment({ productID, userID, content, parentId = null }) {
        const comment = new Comment({
            comment_productId: productID,
            comment_UserId: userID,
            comment_content: content,
            comment_parentId: parentId
        });
        let rightValue;
        if (parentId) {
            // reply comment
            const parentComment = await Comment.findById(convertToObjectID(parentId));
            if (!parentComment) {
                throw new Error('Parent comment not found');
            }
            rightValue = parentComment.comment_right;
            // updateMany comments
            await Comment.updateMany({
                comment_productId: convertToObjectID(productID),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            });

            await Comment.updateMany({
                comment_productId: convertToObjectID(productID),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            });

            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
            await comment.save();
            return comment;

        }
        else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectID(productID)
            }, 'comment_right').sort({ comment_right: -1 });
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;

            }
            else {
                rightValue = 1;
            }
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;

            await comment.save();
            return comment;
        }
    }

    static async getCommentList({
        productID,
        parentComment,
        limit = 50,
        offset = 0
    }) {

        if (!parentComment) {
            throw new NotFoundError('Parent comment not found');
        }
        const commnents = await Comment.find({
            comment_productId: convertToObjectID(productID),
            comment_left: { $gt: parentComment.comment_left },
            comment_right: { $lt: parentComment.comment_right }
        }).select({
            comment_content: 1,
            comment_UserId: 1,
            comment_left: 1,
            comment_right: 1,
            comment_parentId: 1
        }).sort({ comment_left: 1 }).skip(offset).limit(limit);
        return commnents;
    }


    static async getCommentsByParentId({
        productId,
        parentComment,
        limit = 50,
        offset = 0
    }) {
        console.log('parentComment::', parentComment);
        const parentComment_1 = convertToObjectID(parentComment);
        console.log('parentComment_1::', parentComment_1);
        if (parentComment) {
            const parentCommentId = await Comment.findById(parentComment_1).lean();
            console.log('parentCommentId::', parentCommentId);
            if (!parentCommentId) {
                throw new NotFoundError('Parent comment not found');
            }



        }
        const commnents = await Comment.find({
            comment_productId: convertToObjectID(productId),
            comment_parentId: parentComment
        }).select({
            comment_content: 1,
            comment_UserId: 1,
            comment_left: 1,
            comment_right: 1,
            comment_parentId: 1
        }).sort({ comment_left: 1 }).skip(offset).limit(limit).lean();
        console.log('commnents::', commnents);
        return commnents;
    }


    static async deleteComment(payload) {
        const { commentId, productId } = payload;
        if (productId) {
            const product = await Comment.findOne({ comment_productId: convertToObjectID(productId) }).lean();
            if (!product) {
                throw new NotFoundError('Product not found');
            }
        }

        const comment = await Comment.findById(convertToObjectID(commentId));
        if (!comment) {
            throw new NotFoundError('Comment not found');
        }
        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        const width = rightValue - leftValue + 1;

        await Comment.deleteMany({
            comment_productId: convertToObjectID(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        });

        await Comment.updateMany({
            comment_productId: convertToObjectID(productId),
            comment_left: { $gt: rightValue },
        }, {
            $inc: { comment_left: -width }
        })
        await Comment.updateMany({
            comment_productId: convertToObjectID(productId),
            comment_right: { $gt: rightValue },
        }, {
            $inc: { comment_right: -width }
        })
        return true;
    }
}

module.exports = CommentService;