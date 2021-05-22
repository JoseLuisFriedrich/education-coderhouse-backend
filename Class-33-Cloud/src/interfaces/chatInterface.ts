import { Document } from 'mongoose'
import { IUser } from './userInterface'

// interface
export interface IMessage extends Document {
  date: string
  text: string
  user: IUser
}
