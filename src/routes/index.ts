import { Router } from 'express'

import defaults from './default.router'
import v1 from './v1'

const router = Router()

router.use('/', defaults)
router.use(`/api/v1`, v1)

export default router
