import express, { Application, Request, Response } from 'express'
import fs from 'fs'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))
app.get('/', (req: Request, res: Response) => res.send(`⚡️ http://localhost:${PORT}`))

interface Product {
  id: number
  name: string
  quantity: number
}

let items: Array<Product> = []

let itemsCount: number = 0
let itemCount: number = 0

const init = () => {
  if (items.length === 0) {
    const fileItems: string = fs.readFileSync('./db.txt', 'utf-8')
    items = JSON.parse(fileItems)
  }
}

app.get('/items', (req: Request, res: Response) => {
  init()
  itemsCount++
  const response = { items, itemCount: items.length }
  res.status(200).send(response)
})

app.get('/item-random', (req: Request, res: Response) => {
  init()
  itemCount++
  const response = { item: items[Math.floor(Math.random() * items.length)] }
  res.status(200).send(response)
})

app.get('/visits', (req: Request, res: Response) => {
  const response = { visits: { items: itemsCount, item: itemCount } }
  res.status(200).send(response)
})
