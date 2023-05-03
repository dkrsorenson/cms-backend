import { Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpPost } from 'inversify-express-utils'

import { StatusCode } from '../types/http-status-codes'
import { TYPES } from '../types/injectable.types'

import { ValidateRequestMiddleware } from '../middlewares'
import { loginValidator, signupValidator } from '../middlewares/validators/auth.validators'

import { IAuthService } from '../services/auth.service'

export interface IAuthController {
  login(req: Request, res: Response): Promise<void>
  signup(req: Request, res: Response): Promise<void>
}

@controller('/api/v1/auth')
export class AuthController implements IAuthController {
  @inject(TYPES.AuthService) authService!: IAuthService

  /**
   * Handles request for login
   * @param req The request object
   * @param res The response object
   */
  @httpPost('/login', ...loginValidator, ValidateRequestMiddleware)
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Get req body
      const { username, pin } = req.body

      const response = await this.authService.login(username, pin)

      if (response.result === 'success') {
        res.status(StatusCode.OK).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err: any) {
      console.error(err)

      const message = err.message ?? `Sorry, something went wrong.`
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: message })
    }
  }

  /**
   * Handles request to sign up a new user
   * @param req The request object
   * @param res The response object
   */
  @httpPost('/signup', ...signupValidator, ValidateRequestMiddleware)
  async signup(req: Request, res: Response): Promise<void> {
    try {
      // Get req body
      const { username, pin } = req.body

      const response = await this.authService.signup({ username: username, pin: pin })

      if (response.result === 'success') {
        res.status(StatusCode.CREATED).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err: any) {
      console.error(err)

      const message = err.message ?? `Sorry, something went wrong.`
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: message })
    }
  }
}
