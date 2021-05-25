import { Document } from 'mongoose'

// interface
export interface IUser extends Document {
  id: string
  userName: string
  pictureUrl: string
  isAdmin: boolean
}
