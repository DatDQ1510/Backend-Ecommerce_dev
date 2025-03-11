'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const { collection } = require('./shop.model');
const { set } = require('lodash');
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumbn: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_rating: {
        type: Number,
        default: 4.5,
        min: [0, 'Rating must be greater than 0'],
        max: [5, 'Rating must be less than 5'],
        set: value => Math.round(value * 10) / 10 // 4.666666666666666 => 46.66666666666666 => 47 => 4.7
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware : runs before .save() and .create() ...

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();

});


// Define sub-class
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

}, {
    collection: 'Clothing',
    timestamps: true
});
const electronicsSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'Electronics',
    timestamps: true
});
const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

}, {
    collection: 'Furniture',
    timestamps: true
});
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema),
    furniture: model('Furniture', furnitureSchema)

}