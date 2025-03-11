'use strict'
const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');
const { Types } = require("mongoose");
class DiscountController {
    static createDiscountCode = async (req, res, next) => {
        console.log("dat dinh");
        console.log('req.user ::', req.user);
        new SuccessResponse({

            message: 'get list of drafts successfully',
            metadata: await DiscountService.createDiscountCode(
                { payload: { ...req.body, shopId: req.user.userId } })
        }).send(res);
        console.log(1 + 1);
    }
    static getALLProductWithDiscountCode = async (req, res, next) => {
        console.log(1 + 1);
        console.log('req.user ::', req.user);
        const code = req.params.code
        const shopId = rq.user.userId
        new SuccessResponse({

            message: 'get list of drafts successfully',
            metadata: await DiscountService.getALLProductWithDiscountCode(
                { payload: { code: code, shopId: shopId, limit : 50, page : 1 } })
        }).send(res);
        console.log(1 + 1);
    }

}
module.exports = DiscountController;
