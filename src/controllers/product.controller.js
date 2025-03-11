'use strict'
const { SuccessResponse } = require('../core/success.response');

const ProductService = require('../services/product.service');
const ProductService_2 = require('../services/product.service.copy');
const { Types } = require("mongoose");
class ProductController {

    // static async createProduct(req, res, next) {
    //     console.log(req.user.userId);
    //     new SuccessResponse({
    //         message: 'Create product successfully',
    //         metadata: await ProductService.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send(res);

    // }


    static async createProduct(req, res, next) {

        console.log("check test userID ::", req.user.userId);
        new SuccessResponse({
            message: 'Create product successfully',
            metadata: await ProductService_2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);

    }

    static async publishProduct(req, res, next) {
        const productId = req.params.id;
        const shopId = req.user.userId;
        console.log("check test userID", req.user.userId);
        console.log("check test productId", req.params.id);
        console.log("Is userID valid?", Types.ObjectId.isValid(productId));
        console.log("Is productId valid?", Types.ObjectId.isValid(shopId));
        new SuccessResponse({
            message: 'Publish product successfully',
            metadata: await ProductService_2.publishProductByShop(
                {
                    product_shop: shopId,
                    product_id: productId
                }
            )
        }).send(res);
    }

    static async unpublishProduct(req, res, next) {
        const productId = req.params.id;
        const shopId = req.user.userId;
        console.log("check test userID", req.user.userId);
        console.log("check test productId", req.params.id);
        console.log("Is userID valid?", Types.ObjectId.isValid(productId));
        console.log("Is productId valid?", Types.ObjectId.isValid(shopId));
        new SuccessResponse({
            message: 'Unpublish product successfully',
            metadata: await ProductService_2.publishProductByShop(
                {
                    product_shop: shopId,
                    product_id: productId
                }
            )
        }).send(res);
    }

    // query
    /**
     * @description: get all drafts for a shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    static getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list of drafts successfully',
            metadata: await ProductService_2.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    static getAllPublishsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list of publishs successfully',
            metadata: await ProductService_2.findAllPublishsForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    static getListSearchProduct = async (req, res, next) => {
        console.log("check test ip params", req.params);
        const keySearch = req.params.keySearch;
        console.log("check test keySearch ::", keySearch);
        new SuccessResponse({
            message: 'get list search product successfully',
            metadata: await ProductService_2.searchProducts(
                keySearch
            )
        }).send(res);
    }

    static findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all products successfully',
            metadata: await ProductService_2.findAllProducts(
                req.query
            )
        }).send(res);
    }
    static findProduct = async (req, res, next) => {
        console.log("check test ip params ::", req.params);

        new SuccessResponse({
            message: 'get 1 product successfully',
            metadata: await ProductService_2.findProduct(
                { product_id: req.params.id }
            )
        }).send(res);
    }
    //end query

}
module.exports = ProductController;