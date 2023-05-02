import { appDataSource } from '../database/datasource'

import { User } from '../database/entities/user.entity'
import { ErrorResponse } from '../types/errors/error.types'
import { StatusCode } from '../types/http-status-codes'
import { Result } from '../types/result.type'
import { CreateUserPayload, UserResponse } from '../types/user/user.types'

const userRepository = appDataSource.getRepository(User)

export async function getUserByUsername(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username: username } })
}

export async function getUserById(id: number): Promise<User | null> {
  return await userRepository.findOne({ where: { id: id } })
}

export async function getUserByUid(uid: string): Promise<User | null> {
  return await userRepository.findOne({ where: { uid: uid } })
}

export async function getMe(id: number): Promise<Result<UserResponse, ErrorResponse>> {
  const user = await getUserById(id)
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

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const user = userRepository.create({
    username: payload.username,
    pinHash: payload.pinHash,
    status: payload.status,
  })

  const createdUser = await userRepository.save(user)

  return createdUser
}

export default {
  getMe,
  getUserById,
  getUserByUid,
  getUserByUsername,
  createUser,
}
