const blogsRouter = require('express').Router()
const { request } = require('../app')
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
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  // catch not needed because express automatically calls error-handling middleware
})

module.exports = blogsRouter