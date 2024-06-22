const { PASSWORD_MIN_LENGTH } = require('./config');

const USERNAME_REQUIRED = 'Username is required';
const INVALID_EMAIL = 'Invalid email';
const INVALID_PASSWORD = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
const PASSWORD_CONFIRMATION = 'Password confirmation does not match password';

module.exports = {
    USERNAME_REQUIRED,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    PASSWORD_CONFIRMATION
}