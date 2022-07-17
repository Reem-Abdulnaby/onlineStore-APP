const express=require('express')
require('dotenv').config()
const app=express()
const PORT= process.env.PORTّ   
require('./db/db')
app.use(express.json())
const userRouter=require('./router/user')
app.use(userRouter)
const productRouter=require('./router/product')
app.use(productRouter)
const catRouter=require('./router/category')
app.use(catRouter)

app.listen(PORT,()=>console.log('RUNNING..'))