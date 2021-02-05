import express, { Application, Request, Response } from 'express'
import products from './products'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))

app.get('/', (req: Request, res: Response) => res.sendFile('index.html', { root: './public/' }))

//Routes
app.use('/api', products)
