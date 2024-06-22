const { body } = require('express-validator');
const { PASSWORD_MIN_LENGTH } = require('../constants/config');
const { USERNAME_REQUIRED, INVALID_EMAIL, INVALID_PASSWORD, PASSWORD_CONFIRMATION } = require('../constants/error-messages');
const { moduleExpression } = require('@babel/types');

const registerSchema = [
    body('username').notEmpty().withMessage(USERNAME_REQUIRED),
    body('email').isEmail().withMessage(INVALID_EMAIL),
    body('password').isLength({ min: PASSWORD_MIN_LENGTH }).withMessage(INVALID_PASSWORD),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(PASSWORD_CONFIRMATION);
      }
      return true;
    })
  ]

module.exports = registerSchema;