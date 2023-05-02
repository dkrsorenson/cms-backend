import { Router } from 'express'
import { loginValidator, signupValidator } from '../../middlewares/validators/auth.validators'
import { validateReq } from '../../middlewares'

import authController from '../../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login', loginValidator, [validateReq], authController.login)
authRouter.post('/signup', signupValidator, [validateReq], authController.signup)

export default authRouter
