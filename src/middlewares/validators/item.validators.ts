import { query, param, body } from 'express-validator'
import { ItemStatus, ItemVisibility } from '../../database/entities/item.entity'

const ItemStatuses = Object.values(ItemStatus)
const ItemVisibilities = Object.values(ItemVisibility)

export const getItemsValidator = [
  query('page').isInt().withMessage('Page value must be a number.').optional(),
  query('limit').isInt().withMessage('Limit value must be a number.').optional(),
  query('status')
    .toLowerCase()
    .isString()
    .withMessage('Status value must be a string.')
    .isIn(ItemStatuses)
    .withMessage(`Status value must be in the following: ${ItemStatuses}.`)
    .optional(),
  query('visibility')
    .toLowerCase()
    .isString()
    .withMessage('Visibility value must be a string.')
    .isIn(ItemVisibilities)
    .withMessage(`Visibility value must be in the following: ${ItemVisibilities}.`)
    .optional(),
  query('sort')
    .isString()
    .matches('([a-zA-Z0-9 ]*:[a-zA-Z0-9- :]*)')
    .withMessage(`Sort by values must follow the key:asc pattern. Example: "createdAt:desc,title:asc".`)
    .optional(),
]

export const getItemByIdValidator = [param('id').isInt().withMessage('Item ID must be a number.').notEmpty()]

export const createItemValidator = [
  body('title')
    .isString()
    .withMessage('Title value must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Title cannot be empty.')
    .isLength({ max: 120 })
    .withMessage('The title can only be up to 120 characters long.'),
  body('description')
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 500 })
    .withMessage('The description can only be up to 500 characters long.'),
  body('status')
    .toLowerCase()
    .isString()
    .withMessage('Status must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Status cannot be empty.')
    .isIn(ItemStatuses)
    .withMessage(`Status value must be in the following: ${ItemStatuses}.`),
  body('visibility')
    .toLowerCase()
    .isString()
    .withMessage('Visibility must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Visibility cannot be empty.')
    .isIn(ItemVisibilities)
    .withMessage(`Visibility value must be in the following: ${ItemVisibilities}.`),
]

export const updateItemValidator = [
  param('id').isInt().withMessage('Item ID must be a number.').notEmpty().withMessage('Item ID cannot be empty.'),
  body('title')
    .isString()
    .withMessage('Title value must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Title cannot be empty.')
    .isLength({ max: 120 })
    .withMessage('The title can only be up to 120 characters long.')
    .optional(),
  body('description')
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 500 })
    .withMessage('The description can only be up to 500 characters long.')
    .optional(),
  body('status')
    .toLowerCase()
    .isString()
    .withMessage('Status must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Status cannot be empty.')
    .isIn(ItemStatuses)
    .withMessage(`Status value must be in the following: ${ItemStatuses}.`)
    .optional(),
  body('visibility')
    .toLowerCase()
    .isString()
    .withMessage('Visibility must be a string.')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Visibility cannot be empty.')
    .isIn(ItemVisibilities)
    .withMessage(`Visibility value must be in the following: ${ItemVisibilities}.`)
    .optional(),
]

export const deleteItemValidator = [param('id').isInt().withMessage('Item ID must be a number.').notEmpty()]
