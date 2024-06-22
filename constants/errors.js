const { INTERNAL_SERVER_ERROR } = require("./error-messages");

class InternalError extends Error {
    constructor(message, statusCode) {
        console.error(message);
        super(INTERNAL_SERVER_ERROR);
        this.statusCode = 500;
    }
}

class InputError extends Error {
    constructor(message, statusCode) {
        console.info(message);
        super(message);
        this.statusCode = 400;
    }
}

module.exports = {InternalError, InputError};