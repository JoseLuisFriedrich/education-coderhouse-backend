import { model, Model, Schema } from 'mongoose'

import { IMessage } from '../interfaces/chatInterface'

// schema
const MessageSchema: Schema = new Schema({
  date: { type: String, required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
})

// class
const Message: Model<IMessage> = model('Message', MessageSchema)

export const messageGet = async (): Promise<Array<IMessage>> => {
  return await Message.find({}).sort({ date: 1 })
}

export const messageInsert = async (message: IMessage) => {
  try {
    await new Message(message).save()
  } catch (ex) {
    console.error(ex)
  }
}
