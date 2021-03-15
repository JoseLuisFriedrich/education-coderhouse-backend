import { Request, Response } from 'express'
import { Cart } from '../interfaces/cart'
import { Product } from '../interfaces/product'
import { products } from './../controllers/productController'
import { v4 as guid } from 'uuid'

// Helpers
const get = (req: Request): Cart => {
  const cart: Cart = req.session?.cart ? req.session.cart : { id: guid(), timestamp: new Date().toISOString(), products: [] }
  return cart
}

const getProduct = (req: Request, id: string): Product | null => {
  const product = get(req).products.find(p => p.id === Number(id))
  return product ? product : null
}

const set = (req: Request, cart: Cart) => {
  if (req.session) {
    req.session.cart = cart
  }
}

// Main methods
export const cartGet = (req: Request, res: Response) => {
  const cart: Cart = get(req)

  res.status(200).send(cart)
}

export const cartGetById = (req: Request, res: Response) => {
  const id = req.params.id
  const product: Product | null = getProduct(req, id)

  if (product) {
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found in cart' })
  }
}

export const cartInsert = (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const product = products.find(p => p.id === id)

  const cart = get(req)

  if (product) {
    const existing = cart.products.find(p => p.id === id)
    if (existing) {
      if (existing.quantity) {
        existing.quantity += 1
      }
    } else {
      cart.products = [...cart.products, { ...product, quantity: 1 }]
    }
    set(req, cart)
  }

  res.status(201).send(cart)
}

export const cartDelete = (req: Request, res: Response) => {
  const id = req.params.id

  const cart = get(req)
  const product: Product | null = getProduct(req, id)

  if (product) {
    cart.products = cart.products.filter(p => p.id !== Number(id))
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found in cart' })
  }
}
