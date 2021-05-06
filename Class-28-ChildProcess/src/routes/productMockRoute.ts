import express, { Request, Response, Router } from 'express'
import * as productMockController from '../controllers/productMockController'

const productMockRouter = () => {
  const router: Router = express.Router()

  router.get('/:limit?', productMockController.productMockGet)
  router.get('/slowUnblockingProcess/:limit?', productMockController.productMockSlowUnblockingGet)

  return router
}

export default productMockRouter
