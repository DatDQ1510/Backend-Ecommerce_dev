'use strict'

const { product, clothing, electronics, furniture } = require('../product.model.js');
const { Types } = require('mongoose');
const { getSelectData, getUnSelectData } = require('../../utils/index.js');
const findAllDraftsForOneShop = async ({ query, limit, skip }) => {
    return queryProduct(query, limit, skip);

}
const findAllPublishedForOneShop = async ({ query, limit, skip }) => {
    return queryProduct(query, limit, skip);

}

//  search product by user

const searchProductByUser = async (keySearch) => {
    const results = await product.find(
        { isPublished: true, $text: { $search: keySearch } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).lean();

    return results;
};


const publishProductByOneShop = async ({ product_shop, product_id }) => {
    if (!product_shop || !product_id) {
        throw new Error("product_shop hoặc product_id không được để trống.");
    }

    // Chuyển đổi sang ObjectId
    const shopObjectId = new Types.ObjectId(product_shop);
    const productObjectId = new Types.ObjectId(product_id);

    // Cập nhật sản phẩm
    const updatedProduct = await product.findOneAndUpdate(
        { product_shop: shopObjectId, _id: productObjectId },
        { $set: { isDraft: false, isPublished: true } },
        { new: true } // Trả về tài liệu đã cập nhật
    );

    // Nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
        return null;
    }

    return updatedProduct;
};

const unpublishProductByOneShop = async ({ product_shop, product_id }) => {
    console.log("check test userID", product_shop);
    console.log("check test productId", product_id);
    if (!product_shop || !product_id) {
        throw new Error("product_shop hoặc product_id không được để trống.");
    }

    // Chuyển đổi sang ObjectId
    const shopObjectId = new Types.ObjectId(product_shop);
    const productObjectId = new Types.ObjectId(product_id);

    // Cập nhật sản phẩm
    const updatedProduct = await product.findOneAndUpdate(
        { product_shop: shopObjectId, _id: productObjectId },
        { $set: { isDraft: true, isPublished: false } },
        { new: true } // Trả về tài liệu đã cập nhật
    );

    // Nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
        return null;
    }

    return updatedProduct;
};



const queryProduct = async (query, limit, skip) => {
    return await product.find(query).populate('product_shop', ' name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    filter = filter ?? { isPublished: true, isDraft: false };
    console.log("check test filter", filter);
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip) 
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products;
}
const findProduct = async ({ product_id, unselect }) => {
    return await product.find({ _id: product_id })
        .select(getUnSelectData(unselect))
        .lean();

}
module.exports = {
    findAllDraftsForOneShop, publishProductByOneShop,
    findAllPublishedForOneShop, unpublishProductByOneShop,
    searchProductByUser, findAllProducts, findProduct
}