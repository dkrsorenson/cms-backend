import { body } from 'express-validator'

export const signupValidator = [
  body('username')
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Username cannot be empty.')
    .isLength({ max: 60 })
    .withMessage('Username can only be up to 60 characters in length.')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric.'),
  body('pin')
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Pin cannot be empty.')
    .isLength({ min: 4, max: 6 })
    .withMessage('Pin must be between 4 and 6 characters long.')
    .isNumeric()
    .withMessage('Pin must be numeric.'),
]

export const loginValidator = [
  body('username')
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Username cannot be empty.')
    .isLength({ max: 60 })
    .withMessage('Username can only be up to 60 characters in length.')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric.'),
  body('pin')
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Pin cannot be empty.')
    .isLength({ min: 4, max: 6 })
    .withMessage('Pin must be between 4 and 6 characters long.')
    .isNumeric()
    .withMessage('Pin must be numeric.'),
]
