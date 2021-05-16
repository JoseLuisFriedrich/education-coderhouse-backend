import { model, Model, Schema } from 'mongoose'
import logger from '../helpers/logHelper'

import { IMessage } from '../interfaces/chatInterface'

// schema
const MessageSchema: Schema = new Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  user: {
    _id: { type: String, require: true },
    userName: { type: String, require: true },
  },
})

// class
const Message: Model<IMessage> = model('Message', MessageSchema)

export const messageGet = async (): Promise<Array<IMessage>> => {
  return await Message.find({}).sort({ date: 1 })
}

export const messageInsert = async (message: IMessage) => {
  let result: IMessage | undefined
  try {
    result = await new Message(message).save()
  } catch (ex) {
    logger.log('error', ex)
  }
  return result
}

export const messageDeleteAll = async () => {
  let result: number | undefined = 0

  try {
    result = (await Message.deleteMany({})).deletedCount
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}
