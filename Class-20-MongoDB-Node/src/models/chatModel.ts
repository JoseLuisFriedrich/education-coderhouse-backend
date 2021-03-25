import { IMessage, Message } from '../interfaces/chatInterface'

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
