import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import Products from './routes/products.js'

config()

const app = express()
app.use(express.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});
app.use('/products', Products)

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB...')
}).catch((error) => {
  console.log(error)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})