import jwt, { VerifyOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import config from '../configs/env.config'

import { StatusCode } from '../types/http-status-codes'
import { ErrorResponse } from '../types/errors/error.types'
import { Result } from '../types/result.type'
import { InternalJwtPayload, LoginResponse, SignupPayload, SignupResponse } from '../types/auth/auth.types'

import { UserStatus } from '../database/entities/user.entity'
import userService from './user.service'

export async function login(username: string, pin: string): Promise<Result<LoginResponse, ErrorResponse>> {
  const user = await userService.getUserByUsername(username)
  if (!user) {
    console.log(`User not found [username: ${username}]`)

    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: `Invalid username or pin.`,
      },
    }
  }

  const isPinMatch = await comparePassword(pin, user.pinHash)
  if (!isPinMatch) {
    console.log(`Invalid pin attempt [username: ${username}]`)

    return {
      result: 'error',
      statusCode: StatusCode.BAD_REQUEST,
      error: {
        message: `Invalid username or pin.`,
      },
    }
  }

  if (user.status !== UserStatus.Active) {
    return {
      result: 'error',
      statusCode: StatusCode.BAD_REQUEST,
      error: {
        message: `User account is not active.`,
      },
    }
  }

  const token = createJwtToken({
    userUid: user.uid,
    createdAt: new Date(),
  })

  return {
    result: 'success',
    value: {
      token: token,
    },
  }
}

export async function signup(payload: SignupPayload): Promise<Result<SignupResponse, ErrorResponse>> {
  const existingUser = await userService.getUserByUsername(payload.username)
  if (existingUser) {
    return {
      result: 'error',
      statusCode: StatusCode.BAD_REQUEST,
      error: {
        message: `Username must be unique, please try a different username.`,
      },
    }
  }

  try {
    const pinHash = await hashPassword(payload.pin)

    const user = await userService.createUser({
      username: payload.username,
      pinHash: pinHash,
      status: UserStatus.Active,
    })

    return {
      result: 'success',
      value: {
        message: 'Successfully registered user.',
      },
    }
  } catch (err) {
    console.error(err)
    throw new Error(`Signup unexpectedly failed. Please try again.`)
  }
}

export function createJwtToken(payload: InternalJwtPayload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION })
}

export function verifyJwtToken(token: string, options?: VerifyOptions) {
  return jwt.verify(token, config.JWT_SECRET, options)
}

async function hashPassword(password: string): Promise<string> {
  const defaultSaltRounds = 10

  return await bcrypt.hash(password, defaultSaltRounds)
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export default {
  login,
  signup,
  createJwtToken,
  verifyJwtToken,
}
