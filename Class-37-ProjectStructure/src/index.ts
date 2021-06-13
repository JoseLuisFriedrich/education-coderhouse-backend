import express, { Application } from 'express'
import session from 'express-session'
import dbStore from 'connect-mongo'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cluster from 'cluster'
import cookieParser from 'cookie-parser'
import localAuth from './auth/passportLocalAuth'
import compression from 'compression'
import logger from './helpers/logHelper'

import * as os from 'os'
import * as msc from './helpers/miscHelper'
import * as db from './database/mongoDb'
import * as socketio from 'socket.io'
import * as httpLib from 'http'
import * as path from 'path'

import routes from './routes'

const PORT = msc.arg(0, process.env.PORT)
const CLUSTER = msc.arg(1, process.env.MODE) === 'Cluster'

if (cluster.isMaster && CLUSTER) {
  const cpuCount = os.cpus().length
  logger.log('info', `⚡️ http://localhost:${PORT} - 💻 pid: ${process.pid} (Master x${cpuCount} cpus)`)
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }

  cluster.on('exit', () => {
    logger.log('info', `⚡️ http://localhost:${PORT} - 💻 pid: ${process.pid} stopped`)
    cluster.fork()
  })
} else {
  // config
  dotenv.config()

  // app config
  const app: Application = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, 'views')))
  app.use(helmet())
  app.use(cookieParser())
  app.use(compression())
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

  // main
  const http = new httpLib.Server(app)
  const io = new socketio.Server(http)
  http.listen(PORT, () => logger.log('info', `⚡️ http://localhost:${PORT} - 💻 pid: ${process.pid} - ${path.join(__dirname, 'views')}`))

  // auth
  localAuth(app)

  // database
  db.connect()

  // routing
  routes(app, io)

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
}
