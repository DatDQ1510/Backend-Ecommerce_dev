'use strict'

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keytoken.model.js");
const ObjectId = require('mongoose').Types.ObjectId;
class KeyTokenService {
    static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
        try {

            const filter = { user: userId };
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
            const options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error("Error in createKeyToken:", error);
            return error;
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }
    static removeKeyById = async (userId) => {
        console.log("🔹 Raw userId:", userId);
        if (!userId) {
            console.error("❌ userId is invalid:", userId);
            return { acknowledged: false, deletedCount: 0 };
        }

        const userIdObject = new Types.ObjectId(userId);
        console.log("✅ Converted ObjectId:", userIdObject);

        return await keyTokenModel.deleteOne({ user: userIdObject });
    }

}
module.exports = KeyTokenService;