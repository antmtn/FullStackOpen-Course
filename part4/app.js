const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
.then(() => {
  console.log('Connected to MongoDB')
})
.catch(error => {
  console.log('Error connecting to MongoDB:', error.message)
})

app.use(express.json())

app.use('/api/blogs', blogsRouter)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id' })
  }
  next(error)
}

app.use(errorHandler)

module.exports = app