import * as chatController from '../controllers/chatController'

const socketRouter = (io: any) => {
  io.on('connection', (socket: any) => chatController.onConnection(io, socket))
}

export default socketRouter
