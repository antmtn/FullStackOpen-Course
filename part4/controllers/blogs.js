const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if(request.body.title === undefined || request.body.url === undefined){
    return response.status(400).send("title or url missing")
  }
  const blog = new Blog(request.body)
  if (blog.likes === undefined) blog.likes = 0
  const result = await blog.save()
  response.status(201).json(result)
  console.log("Done Processing")
})

module.exports = blogsRouter