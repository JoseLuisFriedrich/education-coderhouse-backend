import { model, Model, Schema } from 'mongoose'
import logger from '../helpers/logHelper'
import { IProduct } from '../interfaces/productInterface'

// schema
const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
})

// class
export const Product: Model<IProduct> = model('Product', ProductSchema)

export const productGet = async (): Promise<Array<IProduct>> => {
  return await Product.find({}).sort({ title: 1 })
}

export const productGetById = async id => {
  return await Product.findOne({ id: id })
}

export const productGetByTitle = async title => {
  return await Product.find({ title: { $regex: title, $options: 'i' } })
}

export const productGetByPriceRange = async (from, to): Promise<Array<IProduct>> => {
  return await Product.find({
    price: { $gte: from, $lte: to },
  }).sort({ title: 1 })
}

export const productInsert = async (product: IProduct) => {
  try {
    await new Product(product).save()
  } catch (ex) {
    logger.log('error', ex)
  }
}

export const productUpdate = async (product: IProduct) => {
  let result: number | undefined = 0

  try {
    result = (await Product.updateOne({ id: product.id }, product)).nModified
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}

export const productUpdateTitle = async (id, title) => {
  let result: number | undefined = 0

  try {
    result = (await Product.updateOne({ id: id }, { title: title })).nModified
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}

export const productUpdatePrice = async (id, price) => {
  let result: number | undefined = 0

  try {
    result = (await Product.updateOne({ id: id }, { price: price })).nModified
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}

export const productDelete = async id => {
  let result: number | undefined = 0

  try {
    result = (await Product.deleteOne({ id: id })).deletedCount
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}

export const productDeleteAll = async () => {
  let result: number | undefined = 0

  try {
    result = (await Product.deleteMany({})).deletedCount
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}
