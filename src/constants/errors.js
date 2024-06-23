const { INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS } = require("./error-messages");

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        console.info(message);
    }
}
class InternalError extends AppError {
    constructor(message) {
        console.error(message);
        super(INTERNAL_SERVER_ERROR, 500);
    }
}

class InputError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

class AuthorizationError extends AppError {
    constructor() {
        super(INVALID_CREDENTIALS, 401);
    }
}

module.exports = {InternalError, InputError, AuthorizationError, NotFoundError};