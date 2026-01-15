const redisPubSubService = require('../services/redisPubsub.service');

class InventoryServiceTest {

    constructor() {
        redisPubSubService.subscribe('purchase_events', (message) => {
            const inventory = JSON.parse(message);
            InventoryServiceTest.updateInventory(inventory.productId, inventory.quantity);
        });
    }
    static updateInventory(productId, quantity) {
        const inventory = {
            productId,
            quantity,
        };
        console.log(`Update inventory for product ${inventory.productId} with quantity ${inventory.quantity}`);
    }
}

module.exports = new InventoryServiceTest();