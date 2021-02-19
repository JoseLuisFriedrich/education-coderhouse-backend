import express, { Application, Request, Response } from 'express'

import handlebars from 'express-handlebars'
import { products } from './products'

const productsView = (app: Application) => {
  //setup
  app.engine(
    'hbs',
    handlebars({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
      layoutsDir: './views/layouts/',
      partialsDir: './views/partials/',
    })
  )

  app.set('views', './views')
  app.set('view engine', 'hbs')
  app.use(express.static('public'))

  //apis
  app.get('/products/view', (req: Request, res: Response) => {
    res.render('main', { products: products, hasProducts: products.length !== 0 })
  })
}

export default productsView
