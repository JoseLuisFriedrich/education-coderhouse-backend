import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import * as mail from '../helpers/mailHelper'
import * as msc from '../helpers/miscHelper'
import * as dbUser from '../models/userModel'

const facebookAuth = (app: any) => {
  app.use(passport.initialize())
  app.use(passport.session())

  const clientID: string = msc.arg(2, process.env.FB_CLIENT_ID) || ''
  const clientSecret: string = msc.arg(3, process.env.FB_CLIENT_SECRET) || ''

  passport.use(
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/user/facebook/login/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await dbUser.userGetById(profile.id)
        //console.log(profile)

        try {
          if (user) {
            //userController.setUser(req, user)
          } else {
            const pictureUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
            console.log(pictureUrl)
            const newUser = new dbUser.User({
              id: profile.id,
              userName: profile.displayName,
              pictureUrl,
              isAdmin: false,
            })

            // userController.setUser(req, newUser)
            await dbUser.userInsert(newUser)
          }

          await mail.send('Facebook Login')
          return done(null, user)
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
