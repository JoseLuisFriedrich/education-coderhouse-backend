import { model, Schema, Model, Document } from 'mongoose'

// interface
export interface IProduct extends Document {
  id: number
  title: string
  price: number
  thumbnail: string
}

// schema
const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
})

// class
export const Product: Model<IProduct> = model('Product', ProductSchema)
