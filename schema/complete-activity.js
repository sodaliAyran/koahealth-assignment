const { body } = require('express-validator');
const { IS_COMPLETED_REQUIRED } = require('../constants/error-messages');

const completeActivitySchema = [
    body('isCompleted')
        .notEmpty()
        .isBoolean()
        .withMessage(IS_COMPLETED_REQUIRED),
  ]

module.exports = completeActivitySchema;