import mongoose from 'mongoose'
import * as msc from '../helpers/miscHelper'
import logger from '../helpers/logHelper'

export let connected = true

export const connString = () => {
  return msc.arg(4, process.env.DB_CONNECTION) || ''
}

export const connect = (): any => {
  mongoose.connect(connString(), { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    connected = false
    logger.log('error', err)
  })
}

export const close = async () => {
  mongoose.connection.close()
}
