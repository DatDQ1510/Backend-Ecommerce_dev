'use strict'

const { discount } = require('../discount.model');

const { Types } = require('mongoose');
const { getSelectData, getUnSelectData } = require('../../utils/index.js');

const findDiscountByCode = async (code, shopId) => {
    return await discount.findOne({ discount_code: code, discount_shopId: shopId }).lean();
}
const convertToObjectId = (id) => {
    return new Types.ObjectId(id);
}
const getSelectDiscountByShop = async ({ limit, sort, page, filter, select }) => {
    const skip = limit * (page - 1);
    const sortBy = sort === 'ctime' ? { ctime: -1 } : { utime: -1 };
    filter = filter ? filter : { discount_shopId: convertToObjectId(shopId) };
    const discounts = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    return discounts;
}
const getUnSelectDiscountByShop = async ({ limit, sort, page, filter, unSelect }) => {
    const skip = limit * (page - 1);
    const sortBy = sort === 'ctime' ? { ctime: -1 } : { utime: -1 };
    filter = filter ? filter : { discount_shopId: convertToObjectId(shopId) };
    const discounts = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean();
    return discounts;
}
module.exports = {
    findDiscountByCode,
    convertToObjectId,
    getSelectDiscountByShop,
    getUnSelectDiscountByShop
}