import { Router } from 'express'

import defaultRoutes from './default.router'
import nonexistentRoutes from './nonexistent.router'
import v1 from './v1'

const router = Router()

router.use('/', defaultRoutes)
router.use(`/api/v1`, v1)
router.use('/', nonexistentRoutes)

export default router
