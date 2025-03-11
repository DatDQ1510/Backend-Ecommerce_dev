'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []  // những refreshToken đã được sử dụng 
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,  // timestamps cần được đặt ở đây
    collection: COLLECTION_NAME // Đặt tên collection tại đây
});

// Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
