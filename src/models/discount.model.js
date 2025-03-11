'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount' // percentage
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start: {
        type: Date,
        required: true
    },
    discount_end: {
        type: Date,
        required: true
    },
    discount_max_uses: { // so lan toi da su dung
        type: Number,
        required: true
    },
    discount_uses_count: { // so discount da duoc su dung
        type: Number,
        required: true
    },
    discount_users_used: { // ai su dung
        type: Array,
        default: []
    },
    discount_max_uses_per_user: {  // so lan toi da 1 user co the su dung
        type: Number,
        required: true
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        require: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: { // so san pham duoc ap dung
        type: Array,
        default: []
    }
}, {
    timestamps: true,  // timestamps cần được đặt ở đây
    collection: COLLECTION_NAME // Đặt tên collection tại đây
});

// Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}