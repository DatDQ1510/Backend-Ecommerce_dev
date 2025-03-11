'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
}
const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
}
class SuccessResponse {
    constructor(message, statusCode = StatusCode.OK, resonStatusCode = ReasonStatusCode.OK, metadata = {}) {
        this.message = !message ? resonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)

    }
}

class OK extends SuccessResponse {
    constructor(message, metadata ) {
        super(message, metadata);
    }   
}

class CREATED extends SuccessResponse {
    constructor(message, metadata, statusCode = StatusCode.CREATED, resonStatusCode = ReasonStatusCode.CREATED, options = {}) {
        super(message, StatusCode.CREATED, ReasonStatusCode.CREATED, metadata);
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}