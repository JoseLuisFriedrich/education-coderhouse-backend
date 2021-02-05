import express, { Request, Response, Router } from 'express'

const router: Router = express.Router()

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

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('products')
})

router.get('/products', (req: Request, res: Response) => {
  if (!products.length) res.status(404).send({ error: "there're not products available" })

  res.status(200).send(products)
})

router.get('/products/:id', (req: Request, res: Response) => {
  const id = req.params.id

  const product = get(id)
  if (product) {
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
})

router.post('/products', (req: Request, res: Response) => {
  const { title, price, thumbnail } = req.body
  const product: Product = { id: products.length + 1, title, price: Number(price), thumbnail }
  // const product: Product = { id: products.length + 1, ...req.body }
  products = [...products, product]

  res.status(201).send(product)
})

router.put('/products', (req: Request, res: Response) => {
  const updated: Product = { ...req.body }

  const productIndex = products.findIndex(p => p.id === updated.id)
  if (~productIndex) {
    products[productIndex] = updated
    res.status(200).send()
  } else {
    res.status(404).send({ error: 'product not found' })
  }
})

router.patch('/products/:id/price', (req: Request, res: Response) => {
  const id = req.params.id
  const { price } = req.body

  const product = get(id)
  if (product) {
    product.price = price
    res.status(200).send()
  } else {
    res.status(404).send({ error: 'product not found' })
  }
})

router.delete('/products/:id', (req: Request, res: Response) => {
  const id = req.params.id

  const product = get(id)
  if (product) {
    products = products.filter(p => p.id !== Number(id))
    res.status(200).send()
  } else {
    res.status(404).send({ error: 'product not found' })
  }
})

export default router
