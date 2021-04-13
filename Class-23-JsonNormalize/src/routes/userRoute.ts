import express, { Router } from 'express'
import * as userController from '../controllers/userController'

const userRouter = () => {
  const router: Router = express.Router()

  router.get('/', userController.userGet)
  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)

  return router
}

export default userRouter
