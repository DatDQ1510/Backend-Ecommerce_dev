'use strict'
const dotenv = require('dotenv').config();
const { findById } = require('../services/apikey.service.js');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: '    '
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY].toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        if (key === process.env.DEV_API_KEY) {
            return next()
        }
        // check Object ApiKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const permission = (permission) => {
    return (req, res, next) => {


        console.log('objKey::', req.objKey);
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        console.log('permission::', req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next();
    }
}

const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

module.exports = {
    apiKey, permission, asyncHandler
}