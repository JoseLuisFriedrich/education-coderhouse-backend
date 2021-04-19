import { Request, Response } from 'express'

import * as db from '../models/productModel'
// import { IProduct } from '../interfaces/productInterface'

import faker from 'faker/locale/es'

// main
export const productMockGet = async (req: Request, res: Response) => {
  if (!req.session?.user?.isAdmin) {
    res.status(401).send({ message: 'User is not Admin' })
    return
  }

  const products: Array<any> = []

  const images = [
    'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/hamburger-fast-food-patty-bread-512.png',
    'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fruit-organic-plant-orange-vitamin-512.png',
    'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/shrimp-prawn-seafood-animal-marine-512.png',
    'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fried-chicken-thigh-fast-food-512.png',
  ]

  const limit = req.query.limit || 10

  await db.productDeleteAll()

  for (let i = 0; i < limit; i++) {
    const product = new db.Product({
      id: i + 1,
      title: faker.commerce.productName(),
      price: Math.floor(Math.random() * 100),
      thumbnail: images[Math.floor(Math.random() * images.length)],
    })

    await db.productInsert(product)
    products.push(product)
  }

  res.status(200).send(products)
}
