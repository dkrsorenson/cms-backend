import { Router } from 'express'

import { list } from '../../controllers/items.controller'

const itemsRouter = Router()

itemsRouter.get('/', list)

export default itemsRouter
