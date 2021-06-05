import express, { Request, Response, Router } from 'express'
import * as productMockController from '../controllers/productMockController'

const productMockRouter = () => {
  const router: Router = express.Router()

  router.get('/:limit?', productMockController.productMockGet)
  router.get('/random/:limit?', productMockController.randomGet)
  router.get('/randomBlocking/:limit?', productMockController.randomBlockingGet)

  return router
}

export default productMockRouter
