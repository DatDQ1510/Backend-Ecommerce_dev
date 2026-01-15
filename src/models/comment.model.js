'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

// Declare the Schema of the Mongo model
const commentSchema = new Schema({
    comment_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment_UserId: {
        type: Number,
        default: '1'
    },
    comment_content: {
        type: String,
        default: 'text'
    },
    comment_left: {
        type: Number,
        dafault: 0
    },
    comment_right: {
        type: Number,  
        default: 0
    },
    comment_parentId: {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,  // timestamps cần được đặt ở đây
        collection: COLLECTION_NAME // Đặt tên collection tại đây
    });

// Export the model
module.exports =
    model(DOCUMENT_NAME, commentSchema)