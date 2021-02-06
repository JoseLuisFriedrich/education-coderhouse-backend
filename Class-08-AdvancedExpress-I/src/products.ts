import { Application, Request, Response } from 'express'

export const products = (app: Application) => {
  interface Product {
    id: number
    title: string
    price: number
    thumbnail: string
  }

  let products: Array<Product> = []

  const get = (id: string) => {
    const product = products.find(p => p.id === Number(id))

    if (product) {
      return product
    } else {
      return null
    }
  }

  app.get('/products', (req: Request, res: Response) => {
    if (products.length) {
      res.status(200).send(products)
    } else {
      res.status(404).send({ error: "there're not products available" })
    }
  })

  app.get('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const product = get(id)
    if (product) {
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'product not found' })
    }
  })

  app.post('/products', (req: Request, res: Response) => {
    const product: Product = { id: products.length + 1, ...req.body }
    products = [...products, product]

    res.status(201).send(product)
  })
}

export default products
