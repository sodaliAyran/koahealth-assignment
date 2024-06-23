const { body } = require('express-validator');
const { DURATION_INVALID, CATEGORY_ID_INVALID, DIFFICULTY_LEVEL_INVALID } = require('../constants/error-messages');

const updateActivitySchema = [
    body('title')
        .optional()
        .notEmpty(),
    body('description')
        .optional()
        .isString()
        .notEmpty(),
    body('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage(DURATION_INVALID),
    body('content')
        .optional()
        .notEmpty(),
    body('categoryId')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage(CATEGORY_ID_INVALID),
    body('difficultyLevelId')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage(DIFFICULTY_LEVEL_INVALID)

  ]

module.exports = updateActivitySchema;