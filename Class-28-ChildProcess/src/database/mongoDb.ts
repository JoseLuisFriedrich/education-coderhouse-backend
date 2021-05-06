import mongoose from 'mongoose'

export let connected = true

export const connString = () => {
  return process.argv.length >= 5 ? process.argv[4] : process.env.DB_CONNECTION || ''
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
