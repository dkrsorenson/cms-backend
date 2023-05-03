import { inject, injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { Request, Response, NextFunction } from 'express'

import { StatusCode } from '../types/http-status-codes'
import { TYPES } from '../types/injectable.types'

import { UserStatus } from '../database/entities/user.entity'

import { IUserService } from '../services/user.service'

@injectable()
export class CheckUserMiddleware extends BaseMiddleware {
  @inject(TYPES.UserService) userService!: IUserService

  async handler(req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> {
    try {
      // Get the user UID from previous midleware
      const uid = res.locals.jwtPayload.userUid
      const user = await this.userService.getUserByUid(uid)

      // Verify the user exists
      if (!user) {
        res.status(StatusCode.UNAUTHORIZED).send({ message: 'Unauthorized.' })
        return
      }

      // Verify it's the correct user
      if (user?.uid !== uid) {
        res.status(StatusCode.UNAUTHORIZED).send({ message: 'Unauthorized.' })
        return
      }

      // Check if user is in an active status
      if (user?.status !== UserStatus.Active) {
        res.status(StatusCode.UNAUTHORIZED).send({ message: 'Unauthorized.' })
        return
      }

      // Add user object to the request
      req.user = user
    } catch (err) {
      console.error(err)
      res.status(StatusCode.UNAUTHORIZED).send({ message: 'Unauthorized.' })
      return
    }

    return next()
  }
}
