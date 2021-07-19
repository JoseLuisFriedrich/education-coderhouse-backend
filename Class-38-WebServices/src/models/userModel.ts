import { model, Model, Schema } from 'mongoose'

import logger from '../helpers/logHelper'
import { IUser } from '../interfaces/userInterface'

// schema
const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  password: { type: String, required: true },
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
    logger.log('error', ex)
  }
}

export const userUpdateIsAdmin = async (userName, isAdmin) => {
  let result: number | undefined = 0

  try {
    result = (await User.updateOne({ userName: userName }, { isAdmin: isAdmin })).nModified
  } catch (ex) {
    logger.log('error', ex)
  }

  return result === 1
}
