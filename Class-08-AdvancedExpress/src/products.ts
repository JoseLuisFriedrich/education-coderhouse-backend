import { Application, Request, Response } from 'express'

export const products = (app: Application) => {
  interface Product {
    id: number
    title: string
    price: number
    thumbnail: string
  }

  let products: Array<Product> = []

  app.get('/products', (req: Request, res: Response) => {
    if (!products.length) res.status(404).send({ error: "there're not products available" })

    res.status(200).send(products)
  })

  app.get('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const product = products.find(p => p.id === Number(id))

    if (!product) res.status(404).send({ error: 'product not found' })
    res.status(201).send(product)
  })

  app.post('/products', (req: Request, res: Response) => {
    let product: Product = { id: products.length + 1, ...req.body }
    products = [...products, product]

    res.status(200).send(product)
  })

  // app.patch('/products', (req: Request, res: Response) => {
  //   let product: Product = { id: products.length + 1, ...req.body }
  //   products = [...products, product]

  //   res.status(200).send(product)
  // })
}

export default products
