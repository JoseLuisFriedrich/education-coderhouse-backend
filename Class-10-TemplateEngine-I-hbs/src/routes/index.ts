import { Application } from 'express'
import productsApi from './products'
import productsView from './products.view'

const routing = (app: Application) => {
  //Routes
  app.use('/products/api', productsApi)

  //Views
  // import('./products.view').then(r => r.default(app))
  productsView(app)
}

export default routing
