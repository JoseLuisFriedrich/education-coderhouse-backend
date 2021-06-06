import express, { Router } from 'express'
import passport from 'passport'

import * as userController from '../controllers/userController'

const userRouter = () => {
  const router: Router = express.Router()

  router.post('/signup', passport.authenticate('signup'), userController.userSignup)
  router.post('/login', passport.authenticate('login'), userController.userLogin)
  router.get('/logout', userController.userLogout)
  router.get('/isAuthenticated', userController.userIsAuthenticated)
  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)

  return router
}

export default userRouter
