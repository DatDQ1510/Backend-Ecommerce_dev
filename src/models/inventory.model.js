'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    inven_location: {
        type: String,
        default: 'Unknown'
    },
    inven_stock: {
        type: Number,
        required: true
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inven_reservations: {
        type: Array,
        default: []
    }
    /*
     cardId: 1
     stock: 100
    createdOn
     */
}, {
    timestamps: true,  // timestamps cần được đặt ở đây
    collection: COLLECTION_NAME // Đặt tên collection tại đây
});

// Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}