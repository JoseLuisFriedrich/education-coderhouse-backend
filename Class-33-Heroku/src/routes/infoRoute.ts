import express, { Request, Response, Router } from 'express'
import * as infoController from '../controllers/infoController'

const productsRouter = () => {
  const router: Router = express.Router()

  router.get('/', infoController.infoGet)

  return router
}

export default productsRouter
