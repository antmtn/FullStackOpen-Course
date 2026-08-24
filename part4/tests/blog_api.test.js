const{test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { update } = require('lodash')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  await User.deleteMany({})
  await User.insertOne(
    {
      _id: "5a422a851b54a676234d17f7",
      username:"user",
      name:"user one",
      passwordHash: null,
      __v: 0
    }
  )

  token = jwt.sign(
    {
    username: "user",
    id: "5a422a851b54a676234d17f7"
    },
    process.env.SECRET
  )
})

test('all blogs returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, 6)
})

test('returned blogs have id property named "id"', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id !== null)
})

test('post endpoint correctly creates a new blog post', async () => {

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send( {title: 'test', author:'author',url:'url', likes:6})
  const blog = response.body
  assert.strictEqual(true, 
    blog.title === 'test' &&
    blog.author === 'author' &&
    blog.url === 'url' &&
    blog.likes === 6
  )
  const response_all = await api.get('/api/blogs')
  assert.strictEqual(response_all.body.length,7)
})

test('post endpoint creates blog post with likes missing', async () => {
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send( {title: 'test', author:'author',url:'url'})
  const blog = response.body
  assert.strictEqual(true, 
    blog.title === 'test' &&
    blog.author === 'author' &&
    blog.url === 'url' &&
    blog.likes === 0
  )
  const response_all = await api.get('/api/blogs')
  assert.strictEqual(response_all.body.length,7)
})

test('post endpoint does not create post with title or url missing', async () => {
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send( {title: 'test', author:'author', likes:6})
  assert.strictEqual(response.statusCode, 400)

  const response2 = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send( {author:'author',url:'url', likes:6})
  assert.strictEqual(response2.statusCode, 400)

  const response_all = await api.get('/api/blogs')
  assert.strictEqual(response_all.body.length,6)
})

test('delete correctly deletes a post when correct ID provided', async() => {
  const id = initialBlogs[0]._id
  const response = await api.delete(`/api/blogs/${id}`)

  const responseAll = await api.get('/api/blogs')
  const inList = responseAll.body.some(blog => blog.id === id)
  assert.strictEqual(inList, false)
  assert.strictEqual(responseAll.body.length,5)
})

test('delete does not delete a post when not present ID provided', async() => {
  const id = 22
  const response = await api.delete(`/api/blogs/${id}`)

  const responseAll = await api.get('/api/blogs')
  assert.strictEqual(responseAll.body.length,6)
})

test('put endpoint correctly updates information of blog post', async() => {
  const id = initialBlogs[0]._id
  const updatedInfo = {title: 'test', author:'author',url:'url', likes:6}
  const response = await api.put(`/api/blogs/${id}`).send(updatedInfo)
  const blog = response.body
  assert.strictEqual(true, 
    blog.title === updatedInfo.title &&
    blog.author === updatedInfo.author &&
    blog.url === updatedInfo.url &&
    blog.likes === updatedInfo.likes
  )
})

test('put endpoint returns 404 when post not found', async() => {
  const id = "5a422bc61b54a676234d17fd"
  const updatedInfo = {title: 'test', author:'author',url:'url', likes:6}
  const response = await api.put(`/api/blogs/${id}`).send(updatedInfo)
  assert.strictEqual(response.status, 404)
})

test('put endpoint returns 404 when id has cast error', async() => {
  const id = "22"
  const updatedInfo = {title: 'test', author:'author',url:'url', likes:6}
  const response = await api.put(`/api/blogs/${id}`).send(updatedInfo)
  assert.strictEqual(response.status, 404)
})

test('post endpoint returns 401 when token not provided', async () => {
  const response = await api
    .post('/api/blogs/')
    .send({title: 'test', author:'author',url:'url', likes:6})
  assert.strictEqual(response.status, 401)
})



after(async () => {
  await mongoose.connection.close()
})