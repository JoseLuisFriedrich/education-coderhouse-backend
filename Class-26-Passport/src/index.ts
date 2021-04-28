import express, { Application } from 'express'
import session from 'express-session'
import dbStore from 'connect-mongo'
import dotenv from 'dotenv'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { Strategy as LocalStrategy } from 'passport-local'

import * as db from './database/mongoDb'
import * as dbUser from './models/userModel'
import * as userController from './controllers/userController'
import { IUser } from './interfaces/userInterface'
import * as socketio from 'socket.io'
import * as httpLib from 'http'
import * as path from 'path'

import routes from './routes'

// config
dotenv.config()

// config
const app: Application = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './Views')))
app.use(cookieParser())
app.use(
  session({
    store: dbStore.create({ mongoUrl: db.connString(), ttl: 600 }),
    secret: 'JLF',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000 * 1000,
    },
  })
)

// auth
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('login', { failureRedirect: '/' }))
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/' }))

passport.use(
  'login',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, userName, password, done) => {
      console.log('jeje')
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
      console.log('jeje')
      const user = await dbUser.userGetByUserName(userName)

      try {
        if (user) {
          //exists
          return done(null, false)
        } else {
          const user: IUser = { ...req.body }
          user.isAdmin = false
          user.loginDate = new Date().toISOString()
          user.expiration = Number(user.expiration)
          user.password = userController.createHash(password)
          userController.setUser(req, user)
          await dbUser.userInsert(user)
        }
      } catch (ex) {
        return done(ex)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  console.log('1')
  done(null, user.userName)
})

passport.deserializeUser(async (userName, done) => {
  console.log('2')

  const user = await dbUser.userGetByUserName(userName)
  done(null, user)
})

// main
const http = new httpLib.Server(app)
const io = new socketio.Server(http)

const PORT = process.env.APP_PORT || 8080
http.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))

// routing
routes(app, io)

// database
db.connect()

// cleanup
const exitHandler = () => {
  // db
  db.close()

  // exit
  process.exit()
}

// shut down events
const exitTypes = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM', 'uncaughtException', 'exit']
exitTypes.forEach(eventType => process.on(eventType, exitHandler))
