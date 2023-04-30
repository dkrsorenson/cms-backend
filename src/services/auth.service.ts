import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import StatusCode from '../types/http-status-codes'
import { ErrorResponse } from '../types/errors/error.types'
import { Result } from '../types/responses/response.types'
import { LoginResponse, SignupPayload, SignupResponse } from '../types/auth/auth.types'

import { UserStatus } from '../database/entities/user.entity'
import * as userService from './user.service'

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
    console.log(`User account is not active [username: ${username}, status: ${user.status}]`)
    return {
      result: 'error',
      statusCode: StatusCode.BAD_REQUEST,
      error: {
        message: `User account is not active.`,
      },
    }
  }

  const token = createJwtToken({
    uid: user.uid,
    username: user.username,
    createdAt: new Date(),
  })

  return {
    result: 'success',
    value: {
      token: `Bearer ${token}`,
    },
  }
}

export async function signup(payload: SignupPayload): Promise<Result<SignupResponse, ErrorResponse>> {
  const existingUser = await userService.getUserByUsername(payload.username)
  if (existingUser) {
    console.log(`User already exists with username [username: ${payload.username}]`)

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
  } catch (err) {
    console.error(`Failed to insert user record`, err)
    throw new Error(`Signup unexpectedly failed. Please try again.`)
  }

  return {
    result: 'success',
    value: {},
  }
}

export function createJwtToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
}

async function hashPassword(password: string): Promise<string> {
  const defaultSaltRounds = 10

  return await bcrypt.hash(password, defaultSaltRounds)
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}
