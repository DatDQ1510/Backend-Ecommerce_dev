'use strict'

const shopModel = require('../models/shop.model.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service.js');
const { createTokenPair } = require('../auth/authUtils.js');
const { getInfoData } = require('../utils/index.js');
const { BadRequestError, ConflictRequestError } = require('../core/error.response.js');
const { Types } = require('mongoose');
// service // 
const { findByEmail } = require('./shop.service.js');
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
};

class AccessService {


    /*
        1. check email
        2. match password
        3. create private key, public key
        4. generate ACCESS_TOKEN,  REFRESH_TOKEN
        5. get data return to client
    */

    static logIn = async ({ email, password, refreshToken = null }) => {
        // 1.

        const foundShop = await findByEmail(email);
        if (!foundShop) {
            throw new BadRequestError({ message: 'Shop not registered' });
        }

        //2.
        const matchPassword = await bcrypt.compare(password, foundShop.password);
        if (!matchPassword) {
            throw new BadRequestError({ message: 'Invalid password' });
        }
        //3.
        // const privateKey = crypto.randomBytes(64).toString('hex');
        // const publicKey = crypto.randomBytes(64).toString('hex');

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });


        // 4.
        const tokens = await createTokenPair({ userId: foundShop._id, email }, privateKey, publicKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id

        })
        // 5.
        return {
            shop: getInfoData(['_id', 'name', 'email'], foundShop),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {

        if (!email || !password || !name) {
            throw new BadRequestError({ message: 'Missing required fields' });
        }

        email = email.trim().toLowerCase(); // Chuẩn hóa email

        // Kiểm tra email đã tồn tại chưa
        const existingShop = await shopModel.findOne({ email }).lean();
        if (existingShop) {
            throw new BadRequestError({ message: 'Shop already registered' });
        }

        // Hash mật khẩu
        const hashPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword, // Lưu mật khẩu đã hash
            role: RoleShop.SHOP
        });

        if (!newShop) {
            throw new ConflictRequestError({ message: 'Failed to create shop' });
        }

        // const privateKey = crypto.randomBytes(64).toString('hex');
        // const publicKey = crypto.randomBytes(64).toString('hex');

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });


        console.log({ privateKey, publicKey });

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey
        });

        if (!keyStore) {
            throw new ConflictRequestError({ message: 'Failed to create key token' });
        }
        // Tạo token
        const tokens = await createTokenPair({ userId: newShop._id, email }, privateKey, publicKey)

        return {
            metadata: {
                shop: getInfoData(['_id', 'name', 'email'], newShop),
                tokens
            }
        }
    }
    static logOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore.user);
        console.log("delKey.user : ", keyStore.user);
        console.log("delKey._id : ", keyStore._id)
        console.log("delKey : ", delKey);
        console.log(1 + 1)
        return delKey;
    }
}

module.exports = AccessService;
