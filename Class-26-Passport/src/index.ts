import express, { Application } from 'express'
import session from 'express-session'
import dbStore from 'connect-mongo'
import dotenv from 'dotenv'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import LocalStrategy from 'passport-local'

import * as db from './database/mongoDb'
import * as dbUser from './models/userModel'
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
app.use(cookieParser())
app.use(express.static(path.join(__dirname, './Views')))
app.use(
  session({
    store: dbStore.create({ mongoUrl: db.connString() }),
    secret: 'JLF',
    resave: false,
    saveUninitialized: false,
  })
)

// auth
passport.use(
  'login',
  new LocalStrategy.Strategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      console.log(username)
      //dbUser.userGetByUsername(userName)

      try {
        if (true) {
          //exists
          if (true) {
            //right pass
            return done(null, username)
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

passport.serializeUser((user, done) => {
  // done(null, user._id)
})

passport.deserializeUser((id, done) => {
  //dbUser.userGetByUsername(userName)
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
