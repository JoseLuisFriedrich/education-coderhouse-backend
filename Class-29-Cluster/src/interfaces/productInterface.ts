import { Document } from 'mongoose'

// interface
export interface IProduct extends Document {
  id: number
  title: string
  price: number
  thumbnail: string
}
