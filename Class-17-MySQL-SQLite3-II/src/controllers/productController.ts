import { Request, Response } from 'express'

import * as db from '../models/product'
import { Product } from '../interfaces/product'

export let products: Array<Product> = []
;(async () => {
  products = await db.productGetAll()
})()

// Helpers
const get = (id: string): Product | null => {
  const product = products.find(p => p.id === Number(id))
  return product ? product : null
}

// Main
export const productGet = (req: Request, res: Response) => {
  if (products.length) {
    res.status(200).send(products)
  } else {
    res.status(404).send({ error: "there're not products available" })
  }
}

export const productGetById = (req: Request, res: Response) => {
  const id = req.params.id
  const product: Product | null = get(id)

  if (product) {
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productInsert = (io: any, req: Request, res: Response) => {
  const id = products.reduce((acc, prod) => (acc = acc > prod.id ? acc : prod.id), 0) + 1
  const product: Product = { id, ...req.body, price: Number(req.body.price) }
  products = [...products, product]

  io.sockets.emit('products', [product])

  //save
  db.productInsert(product)

  res.status(201).send(product)
}

export const productUpdate = (req: Request, res: Response) => {
  const updated: Product = { ...req.body }
  const productIndex = products.findIndex(p => p.id === updated.id)

  if (~productIndex) {
    products[productIndex] = updated
    res.status(200).send(updated)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productUpdatePrice = (req: Request, res: Response) => {
  const id = req.params.id
  const product: Product | null = get(id)

  if (product) {
    const { price } = req.body
    product.price = price
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productDelete = (req: Request, res: Response) => {
  if (!req.session?.user.isAdmin) {
    res.status(401).send({ message: 'User is not Admin' })
    return
  }

  const id = req.params.id
  const product: Product | null = get(id)

  if (product) {
    products = products.filter(p => p.id !== Number(id))
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}
