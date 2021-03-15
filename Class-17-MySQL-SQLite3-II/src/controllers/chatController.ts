import { Message } from '../interfaces/chat'
import * as db from '../models/chat'
import { products } from './../controllers/productController'

let messages: Array<Message> = []

;(async () => {
  messages = await db.messageGet()
})()

export const messageSend = (io: any, socket: any) => {
  socket.emit('chat', [...messages, { date: new Date().toLocaleTimeString(), user: 'Admin', text: 'Bienvenido!' }])

  if (products.length > 0) socket.emit('products', products)

  socket.on('chat', (message: Message) => {
    message.date = new Date().toLocaleTimeString()

    //add
    messages = [...messages, message]

    //save
    db.messageInsert(message)

    //emit
    io.sockets.emit('chat', [message])

    // socket.broadcast.emit -> emits all connected sockets except the one it is being called on.
    // io.sockets.emit -> emits all connected sockets.
  })
}
