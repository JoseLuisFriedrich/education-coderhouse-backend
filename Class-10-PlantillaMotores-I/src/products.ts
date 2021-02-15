import express, { Request, Response, Router } from 'express'

const router: Router = express.Router()

interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
}

export let products: Array<Product> = []

const get = (id: string): Product | null => {
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
  const product: Product = { id: products.length + 1, ...req.body }
  products = [...products, product]

  //res.status(201).send(product)
  res.writeHead(302, {
    Location: '/products/view',
  })
  res.end()
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
  const id = req.params.id
  const product: Product | null = get(id)

  if (product) {
    products = products.filter(p => p.id !== Number(id))
    res.status(200).send(product)
  } else {
    res.status(404).send({ error: 'product not found' })
  }
})

export default router
