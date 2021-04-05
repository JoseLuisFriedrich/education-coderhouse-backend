import express, { Request, Response, Router } from 'express'
import * as productController from '../controllers/productController'

const productsRouter = (io: any) => {
  const router: Router = express.Router()

  io.on('connection', (socket: any) => productController.onConnection(io, socket))

  router.get('/', productController.productGet)
  router.get('/:id', productController.productGetById)
  router.post('/', (req: Request, res: Response) => productController.productInsert(io, req, res))
  router.put('/', productController.productUpdate)
  router.patch('/:id/price', productController.productUpdatePrice)
  router.delete('/:id', productController.productDelete)

  return router
}

export default productsRouter
