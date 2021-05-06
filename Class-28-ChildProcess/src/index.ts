import express, { Application } from 'express'
import session from 'express-session'
import dbStore from 'connect-mongo'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import facebookAuth from './auth/facebookAuth'

import * as db from './database/mongoDb'
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
    rolling: true,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000 * 1000,
    },
  })
)

// auth
// passportAuth(app)
facebookAuth(app)

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
