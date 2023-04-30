export type JwtPayload = {
  uid: string
  username: string
  createdAt: Date
}

export type SignupPayload = {
  username: string
  pin: string
}

export type SignupResponse = {}

export type LoginResponse = {
  token: string
}
