import express, { Application } from 'express'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Hay alguna más simple de hacer los imports y pasarle los argumentos?
;(async () => {
  const http = new (await import('http')).Server(app)
  const io = new (await import('socket.io')).Server(http)

  ;(await import('./routes')).default(app, io)

  http.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))
})()
