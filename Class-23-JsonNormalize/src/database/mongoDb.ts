import mongoose from 'mongoose'

export let connected = true

export const connect = (): any => {
  const connString = process.env.DB_CONNECTION || 'mongodb+srv://root:CoderHouse123@jlf.frrsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    connected = false
    console.error(err)
  })
}

export const close = async () => {
  mongoose.connection.close()
}
