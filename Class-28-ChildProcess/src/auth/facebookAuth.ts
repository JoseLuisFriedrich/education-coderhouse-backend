import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import * as dbUser from '../models/userModel'

const facebookAuth = (app: any) => {
  app.use(passport.initialize())
  app.use(passport.session())

  const clientID = process.argv.length >= 4 ? process.argv[2] : process.env.FB_CLIENT_ID || ''
  const clientSecret = process.argv.length >= 4 ? process.argv[3] : process.env.FB_CLIENT_SECRET || ''

  passport.use(
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/user/facebook/login/callback',
        profileFields: ['id', 'displayName', 'photos', 'emails'],
        // scope: ['email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await dbUser.userGetById(profile.id) //ById

        try {
          if (user) {
            //exists
            //userController.setUser(req, user)
            return done(null, user)
          } else {
            //don't exists
            const pictureUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
            const newUser = new dbUser.User({
              id: profile.id,
              userName: profile.displayName,
              pictureUrl,
              isAdmin: false,
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