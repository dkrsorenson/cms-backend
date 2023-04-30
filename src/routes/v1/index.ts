import { Router } from 'express'

import items from './item.router'
import auth from './auth.router'

const router = Router()

router.use('/items', items)
router.use('/auth', auth)

export default router
