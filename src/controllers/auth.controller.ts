import { Request, Response } from 'express'

import authService from '../services/auth.service'
import { StatusCode } from '../types/http-status-codes'

/**
 * Handles request for login
 * @param req The request object
 * @param res The response object
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    // Get req body
    const { username, pin } = req.body

    const response = await authService.login(username, pin)

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
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    // Get req body
    const { username, pin } = req.body

    const response = await authService.signup({ username: username, pin: pin })

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

export default {
  login,
  signup,
}
