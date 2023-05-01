import { Router } from 'express'

import * as itemController from '../../controllers/item.controller'

const itemRouter = Router()

itemRouter.get('/', itemController.listItems)
itemRouter.get('/:id', itemController.getItemById)
itemRouter.post('/', itemController.createItem)
itemRouter.patch('/:id', itemController.updateItem)
itemRouter.delete('/:id', itemController.deleteItem)

export default itemRouter
