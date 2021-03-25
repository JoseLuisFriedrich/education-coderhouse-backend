import mongoose from 'mongoose'

export const connect = (): any => {
  const connString = process.env.DB_CONNECTION || ''
  mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    console.error(err)
  })
}

export const close = async () => {
  mongoose.connection.close()
}
