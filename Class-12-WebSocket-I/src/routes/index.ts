import { Application } from 'express'
import productsApi from './products'
import productsIo from './products.io'

const routing = (app: Application, io: any) => {
  app.use('/products/api', productsApi)

  productsIo(io)
}

export default routing
