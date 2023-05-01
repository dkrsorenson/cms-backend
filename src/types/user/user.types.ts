import { User, UserStatus } from '../../database/entities/user.entity'

export type CreateUserPayload = {
  username: string
  pinHash: string
  status: UserStatus
}
