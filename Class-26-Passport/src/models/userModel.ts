import { model, Model, Schema } from 'mongoose'

import { IUser } from '../interfaces/userInterface'

// schema
const UserSchema: Schema = new Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  loginDate: { type: String, required: true },
  expiration: { type: Number, required: true },
})

// class
export const User: Model<IUser> = model('User', UserSchema)

export const userGetByUsername = async username => {
  return await User.findOne({ username: username })
}
