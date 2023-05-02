import { Router } from 'express'
import { checkJwt, checkUser, validateReq } from '../../middlewares'
import {
  getItemsValidator,
  getItemByIdValidator,
  createItemValidator,
  updateItemValidator,
  deleteItemValidator,
} from '../../middlewares/validators/item.validators'

import itemController from '../../controllers/item.controller'

const itemRouter = Router()

itemRouter.get('/', getItemsValidator, [validateReq, checkJwt, checkUser], itemController.listItems)
itemRouter.get('/:id([0-9]+)', getItemByIdValidator, [validateReq, checkJwt, checkUser], itemController.getItemById)
itemRouter.post('/', createItemValidator, [validateReq, checkJwt, checkUser], itemController.createItem)
itemRouter.patch('/:id([0-9]+)', updateItemValidator, [validateReq, checkJwt, checkUser], itemController.updateItem)
itemRouter.delete('/:id([0-9]+)', deleteItemValidator, [validateReq, checkJwt, checkUser], itemController.deleteItem)

export default itemRouter
