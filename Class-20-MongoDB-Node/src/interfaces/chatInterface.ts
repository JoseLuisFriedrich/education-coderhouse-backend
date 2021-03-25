import { model, Schema, Model, Document } from 'mongoose'

// interface
export interface IMessage extends Document {
  date: string
  user: string
  text: string
}

// schema
const MessageSchema: Schema = new Schema({
  date: { type: String, required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
})

// class
export const Message: Model<IMessage> = model('Message', MessageSchema)
