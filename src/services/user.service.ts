import { injectable, inject } from 'inversify'
import { Repository } from 'typeorm'

import { IDatabaseService } from '../database/database.service'

import { User } from '../database/entities/user.entity'
import { ErrorResponse } from '../types/errors/error.types'
import { StatusCode } from '../types/http-status-codes'
import { Result } from '../types/result.type'
import { CreateUserPayload, UserResponse } from '../types/user/user.types'
import { TYPES } from '../types/injectable.types'

export interface IUserService {
  getUserByUsername(username: string): Promise<User | null>
  getUserById(id: number): Promise<User | null>
  getUserByUid(uid: string): Promise<User | null>
  getMe(id: number): Promise<Result<UserResponse, ErrorResponse>>
  createUser(payload: CreateUserPayload): Promise<User>
}

@injectable()
export class UserService implements IUserService {
  private userRepository: Repository<User>

  constructor(@inject(TYPES.DatabaseService) databaseService: IDatabaseService) {
    this.userRepository = databaseService.getRepository(User)
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username: username } })
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } })
  }

  async getUserByUid(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uid: uid } })
  }

  async getMe(id: number): Promise<Result<UserResponse, ErrorResponse>> {
    const user = await this.getUserById(id)
    if (!user || user.id !== id) {
      return {
        result: 'error',
        statusCode: StatusCode.NOT_FOUND,
        error: {
          message: 'User not found.',
        },
      }
    }

    return {
      result: 'success',
      value: {
        uid: user.uid,
        username: user.username,
        status: user.status,
      },
    }
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const user = this.userRepository.create({
      username: payload.username,
      pinHash: payload.pinHash,
      status: payload.status,
    })

    const createdUser = await this.userRepository.save(user)

    return createdUser
  }
}
