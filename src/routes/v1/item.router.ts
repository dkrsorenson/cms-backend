import { Router } from 'express'
import { checkJwt, checkUser } from '../../middlewares'

import itemController from '../../controllers/item.controller'

const itemRouter = Router()

itemRouter.get('/', [checkJwt, checkUser], itemController.listItems)
itemRouter.get('/:id([0-9]+)', [checkJwt, checkUser], itemController.getItemById)
itemRouter.post('/', [checkJwt, checkUser], itemController.createItem)
itemRouter.patch('/:id([0-9]+)', [checkJwt, checkUser], itemController.updateItem)
itemRouter.delete('/:id([0-9]+)', [checkJwt, checkUser], itemController.deleteItem)

export default itemRouter
