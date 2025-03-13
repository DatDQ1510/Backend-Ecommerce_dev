'use strict'

const { model } = require("mongoose");
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse} = require("../core/success.response");
const KeyTokenService = require("../services/keyToken.service");
class AccessController {
    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Log out OK !',
            metadata: await AccessService.logOut(req.keyStore)
        }).send(res);
    }
    logIn = async (req, res, next) => {
        new SuccessResponse({
            metadata : await AccessService.lo
            gIn(req.body)
        }).send(res);
    }
     signUp = async (req, res, next) => {

        new CREATED({
            message: ' Registered OK !',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);

    }

}
module.exports = new AccessController();