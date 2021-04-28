import { Document } from 'mongoose'

// interface
export interface IUser extends Document {
  // id: string
  userName: string
  password: string
  isAdmin: boolean
  loginDate: string
  expiration: number
}
