import express, { Router } from 'express'
import passport from 'passport'

import * as userController from '../controllers/userController'

const userRouter = () => {
  const router: Router = express.Router()

  router.get('/facebook/login', passport.authenticate('facebook'))
  router.get('/facebook/login/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }))
  router.get('/logout', userController.userLogout)
  router.get('/isAuthenticated', userController.userIsAuthenticated)
  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)

  return router
}

export default userRouter
