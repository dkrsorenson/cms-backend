import { UserStatus } from '../../database/entities/user.entity'

export type CreateUserPayload = {
  username: string
  pinHash: string
  status: UserStatus
}

export type UserResponse = {
  uid: string
  username: string
  status: UserStatus
}
