const { PASSWORD_MIN_LENGTH } = require('./config');

const USERNAME_REQUIRED = 'Username is required';
const INVALID_EMAIL = 'Invalid email';
const INVALID_PASSWORD = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
const PASSWORD_CONFIRMATION = 'Password confirmation does not match password';
const EITHER_EMAIL_OR_USERNAME = 'Either username or email must be provided';
const INTERNAL_SERVER_ERROR = 'Something went wrong. Try again later';
const USER_NOT_FOUND = 'No user using this username or email has been found'
const INVALID_CREDENTIALS = 'Invalid credentials'
const TITLE_REQUIRED = 'Title is required';
const DURATION_INVALID = 'Duration must be a positive integer';
const CONTENT_REQUIRED = 'Content is required';
const CATEGORY_ID_INVALID = 'Category ID must be an integer';
const DIFFICULTY_LEVEL_INVALID = 'Difficulty Level ID must be an integer';
const CATEGORY_NOT_FOUND = 'Category not found';
const DIFFICULTY_NOT_FOUND = 'Difficulty Level not found';
const ACTIVITY_NOT_FOUND = 'Activity not found';

module.exports = {
    USERNAME_REQUIRED,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    PASSWORD_CONFIRMATION,
    EITHER_EMAIL_OR_USERNAME,
    INTERNAL_SERVER_ERROR,
    USER_NOT_FOUND,
    INVALID_CREDENTIALS,
    TITLE_REQUIRED,
    DURATION_INVALID,
    CONTENT_REQUIRED,
    CATEGORY_ID_INVALID,
    DIFFICULTY_LEVEL_INVALID,
    CATEGORY_NOT_FOUND,
    DIFFICULTY_NOT_FOUND,
    ACTIVITY_NOT_FOUND
}