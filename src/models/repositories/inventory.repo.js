'use strict'

const { inventory } = require('../inventory.model.js')
const { Types } = require('mongoose')

const createInventory = async ({ productId, location = 'Unkown', stock, shopId }) => {
    return await inventory.insertOne({
        inven_productId: productId,
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId
    })
}
module.exports = {
    createInventory
}