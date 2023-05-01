import { Request, Response } from 'express'

import userService from '../services/user.service'
import { StatusCode } from '../types/http-status-codes'

/**
 * Handles request for user's info
 * @param req The request object
 * @param res The response object
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user!
    const response = await userService.getMe(user.id)

    if (response.result === 'success') {
      res.status(StatusCode.OK).json(response.value)
    } else {
      res.status(response.statusCode).json(response.error)
    }
  } catch (err: any) {
    const message = err.message ?? `Sorry, something went wrong.`
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: message })
  }
}

export default {
  getMe,
}
