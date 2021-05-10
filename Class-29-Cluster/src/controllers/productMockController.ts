import { Request, Response } from 'express'
import { fork } from 'child_process'

import * as db from '../models/productModel'
import { IProduct } from '../interfaces/productInterface'

import faker from 'faker/locale/es'

const productImages = [
  'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/hamburger-fast-food-patty-bread-512.png',
  'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fruit-organic-plant-orange-vitamin-512.png',
  'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/shrimp-prawn-seafood-animal-marine-512.png',
  'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fried-chicken-thigh-fast-food-512.png',
]

// main
export const productMockGet = async (req: Request, res: Response) => {
  if (!req.session?.user?.isAdmin) {
    res.status(401).send({ message: 'User is not Admin' })
    return
  }

  const products: Array<any> = []

  const limit = req.params.limit || 4

  await db.productDeleteAll()

  for (let i = 0; i < limit; i++) {
    const product: IProduct = new db.Product({
      id: i + 1, //TODO: remove
      title: faker.commerce.productName(),
      price: Math.floor(Math.random() * 100),
      thumbnail: productImages[Math.floor(Math.random() * productImages.length)],
    })

    await db.productInsert(product)
    products.push(product)
  }

  res.status(200).send(products)
}

export const randomGet = async (req: Request, res: Response) => {
  const limit = req.params.limit || 100000000
  const subProcess = fork('./src/controllers/productMockController')

  subProcess.send(limit)
  subProcess.on('message', payload => {
    res.status(200).send(payload)
  })
}

process.on('message', limit => {
  let images = {}

  for (let i = 0; i < limit; i++) {
    const randomImage = productImages[Math.floor(Math.random() * productImages.length)].split('/').pop() || ''
    if (!images[randomImage]) {
      images = { ...images, [randomImage]: 1 }
    } else {
      images[randomImage] += 1
    }
  }

  const currentProcess: any = process
  currentProcess.send(images)
})
