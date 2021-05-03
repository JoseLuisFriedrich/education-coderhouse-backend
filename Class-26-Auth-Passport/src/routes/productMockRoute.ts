import express, { Router } from 'express'
import * as productMockController from '../controllers/productMockController'

const productMockRouter = (io: any) => {
  const router: Router = express.Router()

  router.get('/:limit?', productMockController.productMockGet)

  return router
}

export default productMockRouter
