'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// Declare the Schema of the Mongo model
const notificationSchema = new Schema({
    noti_type: {
        type: String,
        required: true,
        emun: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001']
    },
    noti_senderId: {

        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'

    },
    noti_receiveId: {
        type: Number,
        required: true
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_options: {
        type: Object,
        default: {}
    },
},
    {
        timestamps: true,  // timestamps cần được đặt ở đây
        collection: COLLECTION_NAME // Đặt tên collection tại đây
    });

// Export the model
module.exports = new model(DOCUMENT_NAME, notificationSchema)