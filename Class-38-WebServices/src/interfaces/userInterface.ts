import { Document } from 'mongoose'

// interface
export interface IUser extends Document {
  userName: string
  password: string
  isAdmin: boolean
  loginDate: string
}
