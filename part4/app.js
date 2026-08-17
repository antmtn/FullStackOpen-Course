const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = config.MONGODB_URI
console.log("mongoUrl", mongoUrl)
mongoose.connect(mongoUrl, { family: 4 })
.then(() => {
  console.log('Connected to MongoDB')
})
.catch(error => {
  console.log('Error connecting to MongoDB:', error.message)
})

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app