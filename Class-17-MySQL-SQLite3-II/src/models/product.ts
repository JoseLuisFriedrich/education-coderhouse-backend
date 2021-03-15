import knex from 'knex'

import { IProduct } from '../interfaces/product'
import dbConfig from '../config/db.mysql'

export const productGetAll = async (): Promise<Array<IProduct>> => {
  const conn = knex(dbConfig())
  let data = new Array<IProduct>()

  try {
    data = await conn.from('products')
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }

  return data
}

export const productInsert = async (product: IProduct) => {
  const conn = knex(dbConfig())

  try {
    await conn('products').insert(product)
  } catch (ex) {
    console.error(ex)
  } finally {
    conn.destroy()
  }
}
