const redisPubSubService = require('../services/redisPubsub.service');

class ProductServiceTest {
    purcharseProduct(productId, quantity) {
        const order = {
            productId,
            quantity,
        };

        redisPubSubService.publish('purchase_events', JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();