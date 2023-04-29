import { Router } from 'express'

import items from './item.router'

const router = Router()

router.use('/items', items)

export default router
