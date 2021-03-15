import knex from 'knex'

import { Product } from '../interfaces/product'
import dbConfig from '../config/db.mysql'

export const productGetAll = async (): Promise<Array<Product>> => {
  const conn = knex(dbConfig())
  let data = new Array<Product>()

  try {
    data = await conn.from('products')
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }

  return data
}

export const productInsert = async (product: Product) => {
  const conn = knex(dbConfig())

  try {
    await conn('products').insert(product)
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }
}
