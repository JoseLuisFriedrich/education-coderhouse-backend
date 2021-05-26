import { Request, Response } from 'express'

import * as db from '../models/productModel'
import { IProduct } from '../interfaces/productInterface'

// socket io
export const onConnection = async (io: any, socket: any) => {
  // onConnection
  const products = await db.productGet()
  if (products.length > 0) socket.emit('products', products)
}

// main
export const productGet = async (req: Request, res: Response) => {
  const products = await db.productGet()
  if (products.length > 0) {
    res.status(200).send(products)
  } else {
    res.status(404).send({ error: "there're not products available" })
  }
}

export const productGetById = async (req: Request, res: Response) => {
  const id = req.params.id

  const product: IProduct | null = await db.productGetById(id)
  if (product) {
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productGetByTitle = async (req: Request, res: Response) => {
  const title = req.params.title

  const products = await db.productGetByTitle(title)
  if (products.length > 0) {
    res.status(200).send(products)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productGetByPriceRange = async (req: Request, res: Response) => {
  const from = req.params.from
  const to = req.params.to

  const products = await db.productGetByPriceRange(from, to)
  if (products.length > 0) {
    res.status(200).send(products)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const productInsert = async (io: any, req: Request, res: Response) => {
  const id = (await db.productGet()).length + 1 //do better
  const product: IProduct = { id, ...req.body, price: Number(req.body.price) }

  await db.productInsert(product)

  io.sockets.emit('products', [product])

  res.status(201).send(id.toString())
}

//todo
export const productUpdate = async (req: Request, res: Response) => {
  const product: IProduct = { ...req.body }

  const updated = await db.productUpdate(product)
  if (updated) {
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not updated' })
  }
}

export const productUpdateTitle = (req: Request, res: Response) => {
  const id = req.params.id
  const { title } = req.body

  const updated = db.productUpdateTitle(id, title)
  if (updated) {
    res.status(200).send('updated')
  } else {
    res.status(404).send({ error: 'product not updated' })
  }
}

export const productUpdatePrice = (req: Request, res: Response) => {
  const id = req.params.id
  const { price } = req.body

  const updated = db.productUpdatePrice(id, price)
  if (updated) {
    res.status(200).send('updated')
  } else {
    res.status(404).send({ error: 'product not updated' })
  }
}

export const productDelete = (req: Request, res: Response) => {
  if (!req.session?.user?.isAdmin) {
    res.status(401).send({ message: 'User is not Admin' })
    return
  }

  const id = req.params.id
  const deleted = db.productDelete(id)
  if (deleted) {
    res.status(200).send('deleted')
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}
