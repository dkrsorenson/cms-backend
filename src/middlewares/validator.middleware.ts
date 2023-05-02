import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { StatusCode } from '../types/http-status-codes'

export const validateReq = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  return res.status(StatusCode.BAD_REQUEST).json({
    message: 'Invalid request, see errors.',
    ...errors,
  })
}
