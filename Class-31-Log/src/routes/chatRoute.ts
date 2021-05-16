import express, { Router } from 'express'

import * as chatController from '../controllers/chatController'

const socketRouter = (io: any) => {
  io.on('connection', (socket: any) => chatController.onConnection(io, socket))

  const router: Router = express.Router()

  router.delete('/', chatController.messageDeleteAll)

  return router
}

export default socketRouter
