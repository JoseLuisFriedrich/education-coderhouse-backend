import mongoose from 'mongoose'
import * as msc from '../helpers/miscHelper'

export let connected = true

export const connString = () => {
  return msc.arg(4, process.env.DB_CONNECTION) || ''
}

export const connect = (): any => {
  mongoose.connect(connString(), { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    connected = false
    console.error(err)
  })
}

export const close = async () => {
  mongoose.connection.close()
}
