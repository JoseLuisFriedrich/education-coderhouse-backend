import { Request, Response } from 'express'
import { ICart, ICartProduct } from '../interfaces/cartInterface'
import * as db from '../models/productModel'
import { v4 as guid } from 'uuid'

// helpers
const getCart = (req: Request): ICart => {
  const cart: ICart = req.session?.cart ? req.session.cart : { id: guid(), timestamp: new Date().toISOString(), products: [] }
  return cart
}

const setCart = (req: Request, cart: ICart) => {
  if (req.session) req.session.cart = cart
}

// main
export const cartGet = (req: Request, res: Response) => {
  const cart: ICart = getCart(req)

  res.status(200).send(cart)
}

export const cartInsert = async (req: Request, res: Response) => {
  const id = req.params.id
  const cart = getCart(req)

  const product = await db.productGetById(id)
  if (product) {
    const existInCart = cart.products.find(p => p._id === id)
    if (existInCart) {
      existInCart.quantity += 1
    } else {
      const cartProduct: ICartProduct = { ...product.toObject(), quantity: 1 }
      cart.products = [...cart.products, cartProduct]
    }
    setCart(req, cart)
    res.status(201).send(cart)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
}

export const cartDelete = async (req: Request, res: Response) => {
  const id = req.params.id

  const cart = getCart(req)
  cart.products = cart.products.filter(p => p._id !== id)
  setCart(req, cart)
  res.status(200).send(cart)
}
