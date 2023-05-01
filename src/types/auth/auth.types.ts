export type InternalJwtPayload = {
  userUid: string
  createdAt: Date
}

export type SignupPayload = {
  username: string
  pin: string
}

export type SignupResponse = {
  message: string
}

export type LoginResponse = {
  token: string
}
