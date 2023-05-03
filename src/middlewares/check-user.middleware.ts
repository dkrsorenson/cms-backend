import { Request, Response, NextFunction } from 'express'

import userService from '../services/user.service'
import { UserStatus } from '../database/entities/user.entity'
import { StatusCode } from '../types/http-status-codes'

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the user UID from previous midleware
    const uid = res.locals.jwtPayload.userUid
    const user = await userService.getUserByUid(uid)

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
