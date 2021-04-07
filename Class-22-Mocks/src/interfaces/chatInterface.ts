import { Document } from 'mongoose'

// interface
export interface IMessage extends Document {
  date: string
  user: string
  text: string
}
