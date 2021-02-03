import express, { Application, Request, Response } from 'express'
// const products = require('./products')
import products from './products'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))
app.get('/', (req: Request, res: Response) => res.send(`⚡️ http://localhost:${PORT}`))

//Products
products(app)
