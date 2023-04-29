import { Router } from 'express'

import items from './items.router'

const router = Router()

router.use('/items', items)

export default router
