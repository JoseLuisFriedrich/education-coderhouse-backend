import express, { Request, Response, Router } from 'express'
import fs from 'fs'

export interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity?: number
}

export let products: Array<Product> = []

const productsFile = '../products.json'
if (fs.existsSync(productsFile)) {
  const content: string = fs.readFileSync(productsFile, 'utf-8')
  products = JSON.parse(content)
}

const productsRouter = (io: any) => {
  const router: Router = express.Router()

  const get = (id: string): Product | null => {
    const product = products.find(p => p.id === Number(id))
    return product ? product : null
  }

  router.get('/', (req: Request, res: Response) => {
    if (products.length) {
      res.status(200).send(products)
    } else {
      res.status(404).send({ error: "there're not products available" })
    }
  })

  router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const product: Product | null = get(id)

    if (product) {
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'product not found' })
    }
  })

  router.post('/', (req: Request, res: Response) => {
    const id = products.reduce((acc, prod) => (acc = acc > prod.id ? acc : prod.id), 0) + 1
    const product: Product = { id, ...req.body, price: Number(req.body.price) }
    products = [...products, product]

    io.sockets.emit('products', [product])

    //save
    fs.promises.writeFile(productsFile, JSON.stringify(products, null, 2), { encoding: 'utf8' })
    // .then(() => { console.log('saved')})

    res.status(201).send(product)
  })

  router.put('/', (req: Request, res: Response) => {
    const updated: Product = { ...req.body }
    const productIndex = products.findIndex(p => p.id === updated.id)

    if (~productIndex) {
      products[productIndex] = updated
      res.status(200).send(updated)
    } else {
      res.status(404).send({ error: 'product not found' })
    }
  })

  router.patch('/:id/price', (req: Request, res: Response) => {
    const id = req.params.id
    const product: Product | null = get(id)

    if (product) {
      const { price } = req.body
      product.price = price
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'product not found' })
    }
  })

  router.delete('/:id', (req: Request, res: Response) => {
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
  })

  return router
}

export default productsRouter
