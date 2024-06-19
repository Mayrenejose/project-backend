import express from 'express'
import routerProducts from './routes/products/index.js'
import routerCarts from './routes/carts/index.js'

const PORT = 8080
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

app.listen(PORT, () => { console.log(`server listened on port ${PORT}`)})