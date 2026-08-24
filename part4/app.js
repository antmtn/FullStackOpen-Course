require('dotenv').config()
const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}
app.use(tokenExtractor)

const userExtractor = async(request, response, next) => {
  if (request.token){
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ 
      error: 'invalid id' 
    })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ 
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({ 
      error: 'token invalid'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

app.use(errorHandler)

module.exports = app