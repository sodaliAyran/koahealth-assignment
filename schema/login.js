const { body } = require('express-validator');
const { PASSWORD_MIN_LENGTH } = require('../constants/config');
const { INVALID_EMAIL, INVALID_PASSWORD, EITHER_EMAIL_OR_USERNAME } = require('../constants/error-messages');
const { InputError } = require('../constants/errors');

const loginSchema = [
    body('username')
        .optional()
        .custom((value, { req }) => {
        if (!value && !req.body.email) {
          throw new InputError(EITHER_EMAIL_OR_USERNAME);
        }
        return true;
      }),
    body('email')
        .optional()
        .isEmail()
        .withMessage(INVALID_EMAIL)
        .custom((value, { req }) => {
            if (!value && !req.body.username) {
              throw new InputError(EITHER_EMAIL_OR_USERNAME);
            }
            return true;
          }),
    body('password')
  ]

module.exports = loginSchema;