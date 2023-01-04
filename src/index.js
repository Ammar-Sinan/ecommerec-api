const express = require('express')
const mongoose = require('mongoose')

const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const cartRouter = require('./routers/cart')
const checkoutRouter = require('./routers/checkout')
const adminRouter = require('./routers/admin')

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-api')


const app = express()
app.use(express.json())


app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/checkout', checkoutRouter)
app.use('/admin', adminRouter)


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})