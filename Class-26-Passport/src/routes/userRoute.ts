import express, { Router } from 'express'
import * as userController from '../controllers/userController'

const userRouter = () => {
  const router: Router = express.Router()

  router.get('/:user/:expiration', userController.userGet)
  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)
  router.get('/logout', userController.userLogout)

  return router
}

export default userRouter
