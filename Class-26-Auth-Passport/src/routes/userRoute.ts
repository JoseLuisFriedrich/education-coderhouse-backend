import express, { Router } from 'express'
import * as userController from '../controllers/userController'
import { passportRouter } from '../auth/passportAuth'

const userRouter = () => {
  const router: Router = express.Router()

  passportRouter(router)

  //router.post('/login', userController.userGet)
  // router.post('/signup', userController.userCreate)
  // router.get('/logout', userController.userLogout)

  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)

  return router
}

export default userRouter
