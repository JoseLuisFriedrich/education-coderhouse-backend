import { Router } from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import * as dbUser from '../models/userModel'
import * as userController from '../controllers/userController'
import { IUser } from '../interfaces/userInterface'

export const facebookRouter = (router: Router) => {
  // router.post('/signup/:expiration', passport.authenticate('signup'), (req, res) => res.status(200).send(req.user))
  // router.post('/login/:expiration', passport.authenticate('login'), (req, res) => res.status(200).send(req.user))
  router.get('/facebook/login', passport.authenticate('facebook'))
  router.get('/facebook/login/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }))

  router.get('/isAuthenticated', async (req, res) => {
    if (req.isAuthenticated()) {
      const user: IUser | null = await dbUser.userGetByUserName((req.user as IUser).userName) //ById
      if (user) {
        user.loginDate = new Date().toISOString()
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
    req.logout()
    res.status(200).send('LoggedOut')
  })
}

const facebookAuth = (app: any) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new FacebookStrategy(
      {
        clientID: 360436435040054,
        clientSecret: 'd166495a867753e9c6e24cf048d8089b',
        callbackURL: '/api/user/facebook/login/callback',
        profileFields: ['id', 'displayName', 'photos', 'emails'],
        scope: ['email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await dbUser.userGetByUserName(profile.displayName) //ById

        try {
          if (user) {
            //exists
            user.loginDate = new Date().toISOString()
            user.expiration = Number(600) //req.originalUrl.split('/').pop()
            user.password = ''
            //userController.setUser(req, user)
            return done(null, user)
          } else {
            //don't exists
            const newUser = new dbUser.User({
              userName: profile.displayName,
              isAdmin: false,
              loginDate: new Date().toISOString(),
              expiration: Number(600), //req.originalUrl.split('/').pop(),
            })

            // userController.setUser(req, user)
            await dbUser.userInsert(newUser)

            return done(null, user)
          }
        } catch (ex) {
          return done(ex)
        }
      }
    )
  )

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (obj: any, cb) {
    cb(null, obj)
  })

  return this
}

export default facebookAuth
