'use strict'

const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const { upLoadFromUrl, upLoadFromLocal, upLoadManyFromLocal } = require('../services/upload.service');
class UploadController {

    static upLoadFromUrl = async (req, res, next) => {
        new SuccessResponse({
            message: 'upload image from url successfully',
            metadata: await upLoadFromUrl()
        }).send(res)
    }
    static upLoadFromLocal = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new BadRequestError('Please upload a file');
        }
        console.log("req ::", req)
        console.log("file ::", file)
        new SuccessResponse({
            message: 'upload image from local successfully',
            metadata: await upLoadFromLocal(
                file.path,

            )
        }).send(res)
    }
    static upLoadManyFromLocal = async (req, res, next) => {
        const { files } = req;
        new SuccessResponse({
            message: 'upload image from local successfully',
            metadata: await upLoadManyFromLocal(
                files
            )
        }).send(res)
    }
}
module.exports = UploadController;