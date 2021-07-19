import { Document } from 'mongoose'

// interfaces
export interface IProduct extends Document {
  _id: string
  title: string
  price: number
  thumbnail: string
}

export interface IProductLink extends Document {
  url: string
}
