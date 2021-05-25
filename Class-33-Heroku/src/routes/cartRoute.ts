import express, { Router } from 'express'

import * as cartController from '../controllers/cartController'

const cartRouter = () => {
  const router: Router = express.Router()

  router.get('/', cartController.cartGet)
  router.post('/:id', cartController.cartInsert)
  router.delete('/:id', cartController.cartDelete)

  return router
}

export default cartRouter
