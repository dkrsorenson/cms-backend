import { Router } from 'express'
import { checkJwt, checkUser } from '../../middlewares'

import userController from '../../controllers/user.controller'

const authRouter = Router()

authRouter.get('/me', [checkJwt, checkUser], userController.getMe)

export default authRouter
