'use strict'

const { BadRequestError } = require('../core/error.response.js');
const { product, clothing, electronics, furniture } = require('../models/product.model.js');
const { list } = require('./product.config.js')
const { findAllDraftsForOneShop,
    publishProductByOneShop,
    findAllPublishedForOneShop,
    unpublishProductByOneShop,
    searchProductByUser,
    findAllProducts,
    findProduct
} = require('../models/repositories/product.repo.js');
const { createInventory } = require('../models/repositories/inventory.repo.js');

class ProductFactory {

    /*
        type, payload
    */


    static productRegistry = {}

    static registerProductType(type, classRef) {
        // nhiều quá thì loop qua từng cái (import product.config và loop qua từng cái)
        // for(let i = 0; i < list.length; i++) {
        //     const item = list[i];
        //     ProductFactory.productRegistry[item.type] = item.classRef;
        // }
        ProductFactory.productRegistry[type] = classRef;
    }


    static async createProduct(type, payload) {

        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError({ message: `Invalid product ${type}` });
        }
        return new productClass(payload).createProduct();

    }

    static async updateProduct(type, payload) {

        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError({ message: `Invalid product ${type}` });
        }
        return new productClass(payload).createProduct();

    }

    // put
    static async publishProductByShop({ product_shop, product_id }) {

        return await publishProductByOneShop({ product_shop: product_shop, product_id: product_id });
    }

    static async unpublishProductByShop({ product_shop, product_id }) {

        return await unpublishProductByOneShop({ product_shop: product_shop, product_id: product_id });
    }
    // end put

    // query
    static async findAllDraftsForShop({ product_shop, limit = 10, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftsForOneShop({ query, limit, skip });

    }
    static async findAllPublishsForShop({ product_shop, limit = 10, skip = 0 }) {
        const query = { product_shop, isPublished: true }

        return await findAllPublishedForOneShop({ query, limit, skip });

    }

    static async searchProducts(keySearch) {
        return await searchProductByUser(keySearch);
    }

    static async findAllProducts({ limit = 60, sort = 'ctime', page = 1, filter = { isPublished: true } }) {

        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumbn'] })
    }
    static async findProduct({ product_id, unsellect = ['isDraft', 'isPublished', 'product_shop', '__v'] }) {
        return await findProduct({ product_id, unsellect });
    }
    // end query



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
        console.log('📌 Creating Product with:', this);
        const newProduct = await product.create({ ...this, _id: product_id });
        console.log(1 + 1)
        if (newProduct) {
            await createInventory({
                productId: newProduct._id,
                shopId: newProduct.product_shop,
                stock: newProduct.product_quantity
            })
        }
        console.log(2 + 2)

        return newProduct;

    }
}

// Define sub-class

class Clothing extends Product {
    async createProduct() {

        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newClothing) throw new BadRequestError({ message: 'Create clothing failed' });

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError({ message: 'Create product failed' });
        return newProduct;
    }
    async updateProduct(product_id) {

    }
}

class Electronics extends Product {
    async createProduct() {
        console.log('📌 Electronics Attributes:', this.product_attributes);
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError({ message: 'Create electronic failed' });

        const newProduct = await super.createProduct(newElectronic._id);
        console.log('📌 New Product:', newProduct);
        if (!newProduct) throw new BadRequestError({ message: 'Create product failed' });
        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFuniture = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFuniture) throw new BadRequestError({ message: 'Create Funiture failed' });

        const newProduct = await super.createProduct(newFuniture._id);
        console.log('📌 New Product:', newProduct);
        if (!newProduct) throw new BadRequestError({ message: 'Create product failed' });
        return newProduct;
    }
}





/// register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);



module.exports = ProductFactory