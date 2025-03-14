'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        emun: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,  // timestamps cần được đặt ở đây
    collection: COLLECTION_NAME // Đặt tên collection tại đây
});

// Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
