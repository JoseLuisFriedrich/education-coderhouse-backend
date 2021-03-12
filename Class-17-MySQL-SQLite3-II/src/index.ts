import express, { Application } from 'express'
import session from 'express-session'
import * as socketio from 'socket.io'
import * as httpLib from 'http'

import cartApi from './routes/cart'
import productsApi from './routes/product'
import userApi from './routes/user'
import chatIo from './routes/chat'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/views'))
app.use(session({ secret: 'JLF', resave: false, saveUninitialized: true }))

const http = new httpLib.Server(app)
const io = new socketio.Server(http)

//Routing
app.use('/cart/api', cartApi(io))
app.use('/products/api', productsApi(io))
app.use('/user/api', userApi())

//io
chatIo(io)

//http
http.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))
