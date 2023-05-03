import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { StatusCode } from '../types/http-status-codes'

@injectable()
export class ValidateRequestMiddleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(StatusCode.BAD_REQUEST).json({
      message: 'Invalid request, see errors.',
      ...errors,
    })

    return
  }
}
