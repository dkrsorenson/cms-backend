import { inject, injectable } from 'inversify'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import config from '../configs/env.config'

import { TYPES } from '../types/injectable.types'
import { StatusCode } from '../types/http-status-codes'
import { ErrorResponse } from '../types/errors/error.types'
import { Result } from '../types/result.type'
import { InternalJwtPayload, LoginResponse, SignupPayload, SignupResponse } from '../types/auth/auth.types'

import { UserStatus } from '../database/entities/user.entity'
import { IUserService } from './user.service'

export interface IAuthService {
  login(username: string, pin: string): Promise<Result<LoginResponse, ErrorResponse>>
  signup(payload: SignupPayload): Promise<Result<SignupResponse, ErrorResponse>>
  createJwtToken(payload: InternalJwtPayload): string
  verifyJwtToken(token: string, options?: VerifyOptions): string | jwt.Jwt | jwt.JwtPayload
}

@injectable()
export class AuthService implements IAuthService {
  @inject(TYPES.UserService) userService!: IUserService

  async login(username: string, pin: string): Promise<Result<LoginResponse, ErrorResponse>> {
    const user = await this.userService.getUserByUsername(username)
    if (!user) {
      console.log(`User not found [username: ${username}]`)

      return {
        result: 'error',
        statusCode: StatusCode.BAD_REQUEST,
        error: {
          message: `Invalid username or pin.`,
        },
      }
    }

    const isPinMatch = await this.comparePassword(pin, user.pinHash)
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

    const token = this.createJwtToken({
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

  async signup(payload: SignupPayload): Promise<Result<SignupResponse, ErrorResponse>> {
    const existingUser = await this.userService.getUserByUsername(payload.username)
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
      const pinHash = await this.hashPassword(payload.pin)

      await this.userService.createUser({
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

      throw new Error(`Signup unexpectedly failed.`)
    }
  }

  createJwtToken(payload: InternalJwtPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION })
  }

  verifyJwtToken(token: string, options?: VerifyOptions): string | jwt.Jwt | jwt.JwtPayload {
    return jwt.verify(token, config.JWT_SECRET, options)
  }

  private async hashPassword(password: string): Promise<string> {
    const defaultSaltRounds = 10

    return await bcrypt.hash(password, defaultSaltRounds)
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
