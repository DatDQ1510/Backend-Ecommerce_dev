const Redis = require('ioredis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient();
        this.publisher = Redis.createClient();
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subcriberChannel, message) => {
            if (subcriberChannel === channel) {
                callback(message);
            }

        }
        )
    }
}

module.exports = new RedisPubSubService();