const{test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
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
    .send( {title: 'test', author:'author', likes:6})
  assert.strictEqual(response.statusCode, 400)

  const response2 = await api
      .post('/api/blogs')
      .send( {author:'author',url:'url', likes:6})
  assert.strictEqual(response2.statusCode, 400)

  const response_all = await api.get('/api/blogs')
  assert.strictEqual(response_all.body.length,6)
})
after(async () => {
  await mongoose.connection.close()
})