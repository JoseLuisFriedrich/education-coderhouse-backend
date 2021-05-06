import express, { Router } from 'express'
import passport from 'passport'

import { IUser } from '../interfaces/userInterface'
import * as userController from '../controllers/userController'
import * as dbUser from '../models/userModel'

const userRouter = () => {
  const router: Router = express.Router()

  router.get('/facebook/login', passport.authenticate('facebook'))
  router.get('/facebook/login/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }))

  router.get('/isAuthenticated', async (req, res) => {
    if (req.isAuthenticated()) {
      const user: IUser | null = await dbUser.userGetById((req.user as IUser).id) //ById
      if (user) {
        userController.setUser(req, user)
        res.status(200).send(user)
      } else {
        res.status(200).send(req.user)
      }
    } else {
      res.status(401).send('ERROR')
    }
  })

  router.get('/logout', (req, res) => {
    req.session?.destroy(err => {
      if (err) {
        res.status(500).send({ status: 'ERROR', body: err })
        return
      }
    })

    req.logout()
    res.status(200).send('ok')
  })

  router.patch('/:id/isAdmin', userController.userUpdateIsAdmin)

  return router
}

export default userRouter
