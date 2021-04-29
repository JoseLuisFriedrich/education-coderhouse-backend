import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import * as dbUser from '../models/userModel'
import * as userController from '../controllers/userController'
import { IUser } from '../interfaces/userInterface'

export const passportRouter = (router: Router) => {
  router.post('/signup/:expiration', passport.authenticate('signup'), (req, res) => res.status(200).send(req.user))
  router.post('/login', passport.authenticate('login'), (req, res) => res.status(200).send(req.user))
  router.get('/logout', (req, res) => {
    req.logout()
    res.status(200).send('OK')
  })
}

const passportAuth = (app: any) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    'login',
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, userName, password, done) => {
        const user = await dbUser.userGetByUserName(userName)

        try {
          if (user) {
            //exists
            if (userController.isValidPassword(password, user.password)) {
              //right pass
              return done(null, user)
            } else {
              //wrong pass
              return done(null, false)
            }
          } else {
            //don't exists
            return done(null, false)
          }
        } catch (ex) {
          return done(ex)
        }
      }
    )
  )

  passport.use(
    'signup',
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, userName, password, done) => {
        const user = await dbUser.userGetByUserName(userName)

        try {
          if (user) {
            //exists
            return done(null, false)
          } else {
            const user: IUser = { ...req.body }
            user.userName = userName
            user.isAdmin = false
            user.loginDate = new Date().toISOString()
            user.expiration = Number(req.originalUrl.replace('/api/user/signup/', '')) //TODO: do better
            user.password = userController.createHash(password)

            userController.setUser(req, user)
            await dbUser.userInsert(user)

            return done(null, user)
          }
        } catch (ex) {
          return done(ex)
        }
      }
    )
  )

  passport.serializeUser((user: any, done) => {
    done(null, user.userName)
  })

  passport.deserializeUser(async (userName, done) => {
    const user = await dbUser.userGetByUserName(userName)
    done(null, user)
  })

  return this
}

export default passportAuth
