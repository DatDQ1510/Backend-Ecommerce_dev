'use strict';

const { connect } = require('mongoose');
const redis = require('redis');
require('dotenv').config();

let client = {};
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
};
const password_redis = process.env.PASSWORD_REDIS;
const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Kết nối tới Redis thất bại',
        en: 'Connect to Redis failed'
    }
};

// 🔹 Thêm thông tin Redis Cloud
const REDIS_CONFIG = {
    socket: {
        host: process.env.HOST_REDIS, // Thay bằng host của bạn
        port: 13518, // Thay bằng port của bạn
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000), // Chiến lược thử lại
        connectTimeout: REDIS_CONNECT_TIMEOUT
    },
    password: process.env.REDIS_PASSWORD
};

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('✅ Redis connected');
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('🛑 Redis connection ended');
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('🔄 Redis reconnecting...');
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.error('❌ Redis error:', err);
    });
};

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        console.error(REDIS_CONNECT_MESSAGE.message.vn);
        process.exit(REDIS_CONNECT_MESSAGE.code);
    }, REDIS_CONNECT_TIMEOUT);
}
const initRedis = async () => {
    try {
        console.log(process.env.HOST_REDIS)
        const instanceRedis = redis.createClient(REDIS_CONFIG);

        await instanceRedis.connect();

        client.instanceConnect = instanceRedis;
        handleEventConnection({ connectionRedis: instanceRedis });
        console.log('🔌 Redis connected');
        console.log('🚀 ~ file: initRedis.js ~ line 6 ~ process.env.REDIS_PASSWORD', password_redis);
    } catch (err) {
        console.error(REDIS_CONNECT_MESSAGE.message.vn, err);
    }
};

const getRedis = () => client.instanceConnect;

const closeRedis = async () => {
    if (client.instanceConnect) {
        await client.instanceConnect.quit();
        console.log('🔌 Redis connection closed.');
    }
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis
};
