import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { IUser } from '../interfaces/userInterface'
import * as dbUser from '../models/userModel'
import * as userController from '../controllers/userController'
import * as mail from '../helpers/mailHelper'

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
              user.loginDate = new Date().toISOString()
              user.password = ''

              await mail.send('Login')
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
            user.loginDate = new Date().toISOString()
            user.userName = userName
            user.isAdmin = false
            user.password = userController.createHash(password)

            await mail.send('Signup')
            await dbUser.userInsert(user)

            user.password = ''
            return done(null, user)
          }
        } catch (ex) {
          return done(ex)
        }
      }
    )
  )

  passport.serializeUser((user: any, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (user: IUser, done) => {
    done(null, user)
  })

  return this
}

export default passportAuth
