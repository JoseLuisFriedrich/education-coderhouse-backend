import { Request, Response } from 'express'

import { IMessage } from '../interfaces/chatInterface'
import * as db from '../models/chatModel'
import * as whatsapp from '../helpers/whatsappHelper'

import { normalize, schema } from 'normalizr'

const normalizeData = (messages): any => {
  const userSchema = new schema.Entity('user', {}, { idAttribute: '_id' })
  const messageSchema = new schema.Entity('message', { user: userSchema }, { idAttribute: '_id' })
  const normalizedData = normalize(JSON.parse(JSON.stringify(messages)), [messageSchema])
  return normalizedData
}

export const onConnection = async (io: any, socket: any) => {
  // onConnection
  const messages = await db.messageGet()

  // emit
  if (messages.length > 0) socket.emit('chat', normalizeData(messages))

  // messageSend
  socket.on('chat', async (message: IMessage) => {
    message.date = new Date().toLocaleTimeString()

    // persist
    const persistedMessage = await db.messageInsert(message)

    if (message.text === 'administrador') {
      whatsapp.send(message.user.userName)
    }

    // emit
    io.sockets.emit('chat', normalizeData([persistedMessage]))
  })
}

export const messageDeleteAll = async (req: Request, res: Response) => {
  const deleted = db.messageDeleteAll()
  if (deleted) {
    res.status(200).send('deleted')
  } else {
    res.status(404).send({ error: 'chat not deleted' })
  }
}
