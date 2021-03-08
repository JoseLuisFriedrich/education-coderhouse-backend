import express, { Request, Response, Router } from 'express'
import { products, Product } from './products'
import { v4 as guid } from 'uuid'

interface Cart {
  id: string
  timestamp: string
  products: Array<Product>
}

const cartRouter = (io: any) => {
  const router: Router = express.Router()

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

  router.get('/', (req: Request, res: Response) => {
    const cart: Cart = get(req)

    if (cart.products.length) {
      res.status(200).send(cart)
    } else {
      res.status(404).send({ error: "there're not products in the cart" })
    }
  })

  router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const product: Product | null = getProduct(req, id)

    if (product) {
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'product not found in cart' })
    }
  })

  router.post('/:id', (req: Request, res: Response) => {
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
  })

  // router.put('/', (req: Request, res: Response) => {
  //   const updated: Product = { ...req.body }
  //   const productIndex = products.findIndex(p => p.id === updated.id)

  //   if (~productIndex) {
  //     products[productIndex] = updated
  //     res.status(200).send(updated)
  //   } else {
  //     res.status(404).send({ error: 'product not found' })
  //   }
  // })

  // router.patch('/:id/price', (req: Request, res: Response) => {
  //   const id = req.params.id
  //   const product: Product | null = get(id)

  //   if (product) {
  //     const { price } = req.body
  //     product.price = price
  //     res.status(200).send(product)
  //   } else {
  //     res.status(404).send({ error: 'product not found' })
  //   }
  // })

  router.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const cart = get(req)
    const product: Product | null = getProduct(req, id)

    if (product) {
      cart.products = cart.products.filter(p => p.id !== Number(id))
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'product not found in cart' })
    }
  })

  return router
}

export default cartRouter
