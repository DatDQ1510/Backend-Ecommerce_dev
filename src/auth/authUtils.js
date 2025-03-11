'use strict'


const { asyncHandler } = require('../helpers/asyncHandler');
const { BadRequestError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const JWT = require('jsonwebtoken');
const { Types } = require('mongoose');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
}
// payload : unique
const createTokenPair = async (payload, privateKey, publicKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '3d'
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.err("error verify accessToken : ", err);
            } else {
                console.log("decode verify accessToken : ", decode);
            }
        });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error("Error in createTokenPair:", error);
    }
}
const authentication = asyncHandler(async (req, res, next) => {
    /*
    1. Check userID missing
    2. get AccessToken 
    3. verify AccessToken
    4. check userId from DBS
    5. check KeyStore with userId
    6. return next()
     */
    //1.



    const userId = req.headers[HEADER.CLIENT_ID];

    if (!userId) {
        throw new BadRequestError({ message: 'Missing userId' });
    }
    //2.aaa

    const keyStore = await findByUserId(userId);

    if (!keyStore) {
        throw new BadRequestError({ message: 'Missing keyStore' });
    }

    //3.
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new BadRequestError({ message: 'Invalid accessToken' });
    }
    //4.
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (decodeUser.userId !== userId) {
            throw new BadRequestError({ message: 'Invalid UserID' });
        }
        req.keyStore = keyStore;
        req.user = decodeUser;
        console.log("req.user:", req.user);
        return next();
    }
    catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}