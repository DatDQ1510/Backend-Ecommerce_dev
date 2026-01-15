'use strict'

const { find } = require("lodash");
const { BadRequestError } = require("../core/error.response")   ;
const { discount } = require("../models/discount.model");
const { findDiscountByCode, convertToObjectId, getSelectDiscountByShop,
    getUnSelectDiscountByShop } = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
/*
    List of discount services
    1. Generate discount code [Shop || ADmin]
    2. Get Discount amount
    3. Get all discount code [User || Shop]
    4. Verify discount code [User]
    5.Delete discount code [Shop || Admin]
    6.Cancel discount coude [User]
*/

class DiscountService {

    static async createDiscountCode({ payload }) {
        // generate discount code
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids,
            applies_to, name, description,
            type, value, max_value, max_uses,
            uses_count, max_uses_per_user
        } = payload;
        console.log('payload ::', payload);
        // kiem tra
        if (new Date() > new Date(end_date)) {
            throw new BadRequestError({ message: 'discount has been expried' });
        }
        const foundDiscount = await findDiscountByCode(code, shopId);
        // chú ý hàm async await ở đây không có nó sẽ trả ra  promise : <pending>
        console.log('foundDiscount ::', foundDiscount);
        if (foundDiscount) {
            throw new BadRequestError({ message: 'Discount code already exists' });
        }
        const newDiscount = new discount({
            discount_code: code,
            discount_start: start_date,
            discount_end: end_date,
            discount_is_active: is_active,
            discount_shopId: shopId,
            discount_min_order_value: min_order_value,
            discount_product_ids: product_ids,
            discount_applies_to: applies_to === 'all' ? 'all' : 'specific',
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user
        });
        return newDiscount.save();
    }
    static async updateDiscountCode(payload) {
        const code = payload.code;
        const shopId = payload.shopId;
        const foundDiscount = findDiscountByCode(code, shopId);
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'Discount not exists' });
        }
    }
    static async getALLProductWithDiscountCode(code, shopId, userId = "unKown", limit, page) {
        const foundDiscount = findDiscountByCode(code, shopId);
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'Discount not exists' });
        }
        const { discount_product_ids, discount_applies_to } = foundDiscount;

        if (discount_applies_to === 'all') {
            // get all product
            const getAllProducts = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
            return getAllProducts;
        } else {
            // get specific product
            const getSpecificProducts = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    isPublished: true,
                    _id: { $in: discount_product_ids }
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
            return getSpecificProducts;
        }
    }
    static async getAllDiscountByShop({
        limit, page, shopId
    }) {
        const discounts = getUnSelectDiscountByShop({
            filter: { discount_shopId: convertToObjectId(shopId), discount_is_active: true },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            unSelect: ['__v', 'discount_shopId'],
        });
        return discounts;
    }
    static async verifyDiscountCode(code, shopId, userId) {
        const foundDiscount = findDiscountByCode(code, shopId);
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'Discount not exists' });
        }
        const { discount_max_uses, discount_uses_count, discount_max_uses_per_user } = foundDiscount;
        if (discount_uses_count >= discount_max_uses) {
            throw new BadRequestError({ message: 'Discount code has been used' });
        }
        const userDiscount = foundDiscount.discount_users_used.find((user) => user.userId === userId);
        if (userDiscount && userDiscount.uses >= discount_max_uses_per_user) {
            throw new BadRequestError({ message: 'Discount code has been used' });
        }
        return foundDiscount;
    }
    static async deleteDiscountCode(code, shopId) {
        const foundDiscount = findDiscountByCode(code, shopId);
        if (!foundDiscount) {
            throw new BadRequestError({ message: 'Discount not exists' });
        }
        // co the tao ra 1 bang de luu cac discount da xoa(nen lam nhu vay)
        return foundDiscount.deleteOne();
    }
    static async cancelDiscountCode(code, shopId, userId) {

    }
}
module.exports = DiscountService;