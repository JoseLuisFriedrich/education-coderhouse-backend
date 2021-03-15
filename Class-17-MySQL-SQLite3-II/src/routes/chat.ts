import * as chatController from './../controllers/chatController'

const socketIo = (io: any) => {
  io.on('connection', (socket: any) => chatController.messageSend(io, socket))
}

export default socketIo
