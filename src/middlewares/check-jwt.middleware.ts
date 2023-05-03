import { inject, injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { Request, Response, NextFunction } from 'express'

import { StatusCode } from '../types/http-status-codes'
import { TYPES } from '../types/injectable.types'

import { IAuthService } from '../services/auth.service'

const AUTH_HEADER_NAME = 'authorization'

@injectable()
export class CheckJwtMiddleware extends BaseMiddleware {
  @inject(TYPES.AuthService) authService!: IAuthService

  async handler(req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> {
    // Get the jwt token from the headers
    const token = String(req.headers[AUTH_HEADER_NAME.toLowerCase()])
    const cleanedToken = token.replace('Bearer', '').trim()

    // Try to validate the token and get data
    try {
      const jwtPayload = this.authService.verifyJwtToken(cleanedToken)
      res.locals.jwtPayload = jwtPayload
    } catch (err: any) {
      console.log('Failed to verify JWT token', err)

      // If token is not valid, respond with 401 (unauthorized)
      if (err?.name === 'TokenExpiredError') {
        res.status(StatusCode.UNAUTHORIZED).send({ message: 'Expired token, unauthorized.' })
      } else {
        res.status(StatusCode.UNAUTHORIZED).send({ message: 'Invalid token, unauthorized.' })
      }
      return
    }

    return next()
  }
}
