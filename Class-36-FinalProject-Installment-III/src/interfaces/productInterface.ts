import { Document } from 'mongoose'

// interfaces
export interface IProduct extends Document {
  id: number
  title: string
  price: number
  thumbnail: string
}

export interface IProductLink extends Document {
  url: string
}
