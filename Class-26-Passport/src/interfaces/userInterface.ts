import { Document } from 'mongoose'

// interface
export interface IUser extends Document {
  id: number
  username: string
  isAdmin: boolean
  loginDate: string
  expiration: number
}
