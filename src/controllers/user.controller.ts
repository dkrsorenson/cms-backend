import { Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpGet } from 'inversify-express-utils'

import { StatusCode } from '../types/http-status-codes'
import { TYPES } from '../types/injectable.types'

import { CheckUserMiddleware, CheckJwtMiddleware } from '../middlewares'

import { IUserService } from '../services/user.service'

export interface IUserController {
  getMe(req: Request, res: Response): Promise<void>
}

@controller('/api/v1/users')
export class UserController implements IUserController {
  @inject(TYPES.UserService) userService!: IUserService

  /**
   * Handles request for user's info
   * @param req The request object
   * @param res The response object
   */
  @httpGet('/me', CheckJwtMiddleware, CheckUserMiddleware)
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      const response = await this.userService.getMe(req.user.id)

      if (response.result === 'success') {
        res.status(StatusCode.OK).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err: any) {
      console.error(err)

      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch user information.' })
    }
  }
}
