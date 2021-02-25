// const productsIo = (io: any) => {
//   io.on('connection', (socket: any) => {
//     socket.on('product', (message: JSON) => {
//       // socket.broadcast.emit -> emits all connected sockets except the one it is being called on.
//       // io.sockets.emit -> emits all connected sockets.
//       io.sockets.emit('broadcast', message)
//     })
//   })
// }

// export default productsIo
