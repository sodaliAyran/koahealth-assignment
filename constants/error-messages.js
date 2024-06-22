const { PASSWORD_MIN_LENGTH } = require('./config');

const USERNAME_REQUIRED = 'Username is required';
const INVALID_EMAIL = 'Invalid email';
const INVALID_PASSWORD = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
const PASSWORD_CONFIRMATION = 'Password confirmation does not match password';
const EITHER_EMAIL_OR_USERNAME = 'Either username or email must be provided';
const INTERNAL_SERVER_ERROR = 'Something went wrong. Try again later';
const USER_NOT_FOUND = 'No user using this username or email has been found'
const INVALID_CREDENTIALS = 'Invalid credentials'

module.exports = {
    USERNAME_REQUIRED,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    PASSWORD_CONFIRMATION,
    EITHER_EMAIL_OR_USERNAME,
    INTERNAL_SERVER_ERROR,
    USER_NOT_FOUND,
    INVALID_CREDENTIALS
}