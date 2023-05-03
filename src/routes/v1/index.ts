import { Router } from 'express'

import items from './item.router'
import auth from './auth.router'
import user from './user.router'

const router = Router()

router.use('/items', items)
router.use('/auth', auth)
router.use('/users', user)

export default router
