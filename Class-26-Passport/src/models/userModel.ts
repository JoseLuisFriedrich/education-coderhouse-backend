import { model, Model, Schema } from 'mongoose'

import { IUser } from '../interfaces/userInterface'

// schema
const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  loginDate: { type: String, required: true },
  expiration: { type: Number, required: true },
})

// class
export const User: Model<IUser> = model('User', UserSchema)

export const userGetByUserName = async userName => {
  return await User.findOne({ userName: userName })
}

export const userInsert = async (user: IUser) => {
  try {
    await new User(user).save()
  } catch (ex) {
    console.error(ex)
  }
}
