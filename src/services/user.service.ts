import { appDataSource } from '../database/datasource'

import { User } from '../database/entities/user.entity'
import { CreateUserPayload } from '../types/user/user.types'

const userRepository = appDataSource.getRepository(User)

export async function getUserByUsername(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username: username } })
}

export async function getUserById(id: number): Promise<User | null> {
  return await userRepository.findOne({ where: { id: id } })
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const user = new User()
  user.username = payload.username
  user.pinHash = payload.pinHash
  user.status = payload.status

  await userRepository.save(user)

  return user
}
