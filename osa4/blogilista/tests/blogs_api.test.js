const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "www.asdsf.com", likes: 12 },
    { title: "First class tests", author: "Robert C. Martin", url: "www.qwerty.com", likes: 10 },
    { title: "TDD harms architecture", author: "Robert C. Martin", url: "www.ghjkl.com", likes: 15 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert.ok(firstBlog.id)
  assert.strictEqual(firstBlog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/await testi',
    author: 'Maija Mehiläinen',
    url: 'www.esimerkki.com',
    likes: 1 }   
  
  await api.post('/api/blogs').send(newBlog).expect(201)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})


test('likes set to zero if no likes', async () => {
  const newBlog = {
    title: 'Likes testi',
    author: 'Maija Mehiläinen',
    url: 'www.esimerkki.com'}   
  
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'www,lolxd.com' }
  await api.post('/api/blogs').send(newBlog).expect(400)
})


test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'Erkki Esimerkki' }
  await api.post('/api/blogs').send(newBlog).expect(400)
})


test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)
  assert.ok(!titles.includes(blogToDelete.title))
})

test('likes can be updated', async () => {
  const blogs = await api.get('/api/blogs')
  const blogToUpdate = blogs.body[0]

  const updatedLikes = {
    likes: blogToUpdate.likes +1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes +1)
})


afterAll(async () => {
  await mongoose.connection.close()
})