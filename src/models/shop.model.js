'use strict'

const { uniq } = require('lodash');
const mongoose = require('mongoose');
const { model, Schema, Types } = mongoose;

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopScheam = new Schema({
    name: {
        type: String,
        trim: true,
        length: 150
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopScheam);

