import express, { Application, Request, Response } from 'express'
import productsRouter, { products } from './products'
//import productsViewRouter from './products.view'

const PORT = 8080
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`⚡️ http://localhost:${PORT}`))

//Routes
app.use('/products/api', productsRouter)
//app.use('/products/view', productsViewRouter)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/products/view', (req: Request, res: Response) => {
  res.render('layouts/index.ejs', { products: products, hasProducts: products.length !== 0 })
})
