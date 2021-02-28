import express, { Application } from 'express'
import * as socketio from 'socket.io'
import * as httpLib from 'http'

import productsApi from './routes/products'
import chat from './routes/chat'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const http = new httpLib.Server(app)
const io = new socketio.Server(http)

//Routing
app.use('/products/api', productsApi(io))

chat(io)

//http
http.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))
