const { body } = require('express-validator');
const { InputError } = require('../constants/errors');
const { TITLE_REQUIRED, DURATION_INVALID, CONTENT_REQUIRED, CATEGORY_ID_INVALID, DIFFICULTY_LEVEL_INVALID } = require('../constants/error-messages');

const createActivitySchema = [
    body('title')
        .notEmpty()
        .withMessage(TITLE_REQUIRED),
    body('description')
        .optional()
        .isString(),
    body('duration')
        .isInt({ min: 1 })
        .withMessage(DURATION_INVALID),
    body('content')
        .notEmpty()
        .withMessage(CONTENT_REQUIRED),
    body('categoryId')
        .isInt()
        .withMessage(CATEGORY_ID_INVALID),
    body('difficultyLevelId')
        .isInt()
        .withMessage(DIFFICULTY_LEVEL_INVALID)

  ]

module.exports = createActivitySchema;