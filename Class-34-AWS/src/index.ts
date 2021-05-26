import express, { Application } from 'express'
// import session from 'express-session'
// import dbStore from 'connect-mongo'
// import dotenv from 'dotenv'
import cluster from 'cluster'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import AWS from 'aws-sdk'

import * as os from 'os'
import * as msc from './helpers/miscHelper'
// import * as db from './database/mongoDb'
import * as socketio from 'socket.io'
import * as httpLib from 'http'
import * as path from 'path'

import routes from './routes'
import logger from './helpers/logHelper'
// import facebookAuth from './auth/facebookAuth'

const PORT = msc.arg(0, process.env.PORT || 3000)
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
  // dotenv.config()

  AWS.config.region = msc.arg(4, process.env.AWS_REGION)
  // AWS.config.update({
  //   accessKeyId: msc.arg(5, process.env.AWS_ACCESS_KEY_ID),
  //   secretAccessKey: msc.arg(6, process.env.AWS_SECRET_ACCESS_KEY),
  //   region: msc.arg(4, process.env.AWS_REGION),
  // })

  const sns = new AWS.SNS()
  const db = new AWS.DynamoDB()

  // app config
  const app: Application = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, 'views')))
  app.use(cookieParser())
  app.use(compression())

  // main
  const http = new httpLib.Server(app)
  const io = new socketio.Server(http)
  http.listen(PORT, () => logger.log('info', `⚡️ http://localhost:${PORT} - 💻 pid: ${process.pid}`))

  app.post('/insertMail', (req, res) => {
    const item = { email: { S: req.body.mail } }

    db.putItem({ TableName: 'coderhouse', Item: item }, (err, data) => {
      if (err) {
        res.status(200).send(err.toString())
      } else {
        sns.publish(
          {
            Message: 'OK',
            Subject: 'New User',
            TopicArn: 'arn:aws:sns:us-east-2:463299527882:dynamodb',
          },
          (err, data) => {
            if (err) {
              res.status(200).send(err.toString())
            } else {
              res.status(201).send('OK')
            }
          }
        )
      }
    })
  })

  // // auth
  // facebookAuth(app)

  // // database
  // db.connect()

  // // routing
  routes(app, io)

  // cleanup
  const exitHandler = () => {
    // db
    // db.close()

    // exit
    process.exit()
  }

  // shut down events
  const exitTypes = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM', 'uncaughtException', 'exit']
  exitTypes.forEach(eventType => process.on(eventType, exitHandler))
}
