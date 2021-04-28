import express, { Router } from 'express'
import * as userController from '../controllers/userController'
import passport from 'passport'

const userRouter = () => {
  const router: Router = express.Router()

  router.post('/login', userController.userGet)
  router.post('/signup', userController.userCreate)
  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)
  router.get('/logout', userController.userLogout)

  return router
}

export default userRouter
