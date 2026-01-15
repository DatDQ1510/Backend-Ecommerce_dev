'use strict'

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronics } = require('../models/product.model.js');
const { pushNotiToSystem } = require('./notification.service.js');


class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                console.log('Clothing 1 ')
                return await new Clothing(payload).createProduct();
            case 'Electronics':
                console.log('Electronics 1')
                return await new Electronics(payload).createProduct();
            default:
                throw new BadRequestError({ message: `Invalid product ${type}` });
        }

    }
}

class Product {
    constructor(payload) {
        this.product_name = payload.product_name;
        this.product_thumbn = payload.product_thumbn;
        this.product_description = payload.product_description;
        this.product_price = payload.product_price;
        this.product_quantity = payload.product_quantity;
        this.product_type = payload.product_type;
        this.product_shop = payload.product_shop;
        this.product_attributes = payload.product_attributes;
    }

    async createProduct(product_id) {
        console.log('📌 Product ID: Dinh QUoc Dat',);
        await pushNotiToSystem({
            type: 'SHOP-001',
            receiverId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop
            }
        })

        const newProduct = await product.create({
            ...this,
            _id: product_id
        });

        return newProduct;
    }
}

// Define sub-class

class Clothing extends Product {
    async createProduct() {
        console.log('Clothing 2')
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        console.log('Clothing 3')
        if (!newClothing) throw new BadRequestError({ message: 'Create clothing failed' });

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError({ message: 'Create product failed' });
        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError({ message: 'Create electronic failed' });

        const newProduct = await super.createProduct(newElectronic._id);

        if (!newProduct) throw new BadRequestError({ message: 'Create product failed' });
        return newProduct;
    }
}

module.exports = ProductFactory