import express, { Application, Request, Response } from 'express'

import { products } from './products'

const productsView = (app: Application) => {
  //setup
  app.set('views', './views')
  app.set('view engine', 'pug')
  app.use(express.static('public'))

  //apis
  app.get('/products/view', (req: Request, res: Response) => {
    res.render('layouts/index.pug', { products: products, hasProducts: products.length !== 0 })
  })
}

export default productsView
