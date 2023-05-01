import { Router } from 'express'

import items from './item.router'
import auth from './auth.router'
import user from './user.router'

const router = Router()

router.use('/items', items)
router.use('/auth', auth)
router.use('/user', user)

export default router
