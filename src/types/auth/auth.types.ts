export type JwtPayload = {
  uid: string
  username: string
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
