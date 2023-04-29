import { Router } from 'express'

import { list } from '../../controllers/item.controller'

const itemRouter = Router()

itemRouter.get('/', list)

export default itemRouter
