import { User } from '../../database/entities/user.entity'

// To make the file a module and avoid TypeScript errors
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User
    }
  }
}
