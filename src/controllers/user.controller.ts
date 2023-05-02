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
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    const response = await userService.getMe(req.user.id)

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

export default {
  getMe,
}
