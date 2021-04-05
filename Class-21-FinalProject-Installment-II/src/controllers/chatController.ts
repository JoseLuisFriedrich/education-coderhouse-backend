import { IMessage } from '../interfaces/chatInterface'
import * as db from '../models/chatModel'

export const onConnection = async (io: any, socket: any) => {
  // onConnection
  const messages = await db.messageGet()
  if (messages.length > 0) socket.emit('chat', messages)

  // messageSend
  socket.on('chat', (message: IMessage) => {
    message.date = new Date().toLocaleTimeString()
    message.user = message.user.replace('[AUTOGENERADO] ', '')

    // persist
    db.messageInsert(message)

    // emit
    io.sockets.emit('chat', [message])
  })
}
