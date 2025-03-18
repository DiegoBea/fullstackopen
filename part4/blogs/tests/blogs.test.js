const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogHelper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')

const app = require('../app')
const { url } = require('node:inspector')
const api = supertest(app)

test('API returns blogs', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of blogHelper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogHelper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {
  test('Favourite blog', () => {
    const result = listHelper.favouriteBlog(blogHelper.initialBlogs)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

test('Author with most blogs', () => {
  const result = listHelper.mostBlogs(blogHelper.initialBlogs)
  assert.deepStrictEqual(result, {
    author: 'Robert C. Martin',
    blogs: 3,
  })
})

test('Author with most likes', () => {
  const result = listHelper.mostLikes(blogHelper.initialBlogs)
  assert.deepStrictEqual(result, {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  })
})

test('Blogs has ID', async () => {
  const blogs = await blogHelper.blogsInDb()
  const first = blogs.pop()
  assert.strictEqual(first.hasOwnProperty("id"), true)
})

test('Create new blog', async () => {
  // Define new blog properties
  const newBlogProperties = {
    title: 'Test blog',
    author: 'Test author',
    likes: 10,
    url: "https://google.es"
  }

  // Save blog using API
  await api.post('/api/blogs').send(newBlogProperties).expect(201)
  // Get current blogs in ddbb
  const blogsAtEnd = await blogHelper.blogsInDb()
  // Check if length is equal
  assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length + 1)
  // Get only blogs that contains this title
  const filter = blogsAtEnd.filter((blog) => blog.title === newBlogProperties.title)
  // Check if filtered blogs length are 1
  assert.strictEqual(filter.length, 1)

})

test('Set default 0 when no likes', async () => {
  // Set blog properties (without likes)
  const newBlogProperties = {
    title: 'Test blog',
    author: 'Test author',
    url: "https://google.es"
  }

  // Save blog using API
  await api.post('/api/blogs').send(newBlogProperties).expect(201)

  // Get blogs in ddbb
  const blogsAtEnd = await blogHelper.blogsInDb()

  // Get last blog
  const lastBlog = blogsAtEnd.pop()

  // Check if lastBlog likes are equals to 0
  assert.strictEqual(lastBlog.likes, 0)
})

test('Blog without title or url fails when saving', async () => {
  // Set properties
  const newBlogProperties = {
    author: 'Test author',
  }

  // Try save blog
  await api.post('/api/blogs').send(newBlogProperties).expect(400)

  // Get blogs in ddbb
  const blogsAtEnd = await blogHelper.blogsInDb()

  // Check if lengths are equals
  assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length)
})

test('A blog can be delete', async () => {
  // Get first blog
  const blog = blogHelper.initialBlogs[0];
  // Delete blog
  await api.delete(`/api/blogs/${blog._id}`).expect(204)
  // Get final blogs
  const blogsAtEnd = await blogHelper.blogsInDb()

  // Compare lengths
  assert.strictEqual(blogHelper.initialBlogs.length - 1, blogsAtEnd.length)
})

test('A blog can be updated', async () => {
  // Get first blog
  const blog = blogHelper.initialBlogs[0]
  // Get likes of the blog
  const likes = blog.likes

  // Update blog
  await api.put(`/api/blogs/${blog._id}`).send({ 'likes': (likes + 1) })

  // Get updated blog
  const updatedBlog = (await blogHelper.blogsInDb()).find(item => item.id === blog._id)

  // Check if likes are different
  assert.strictEqual(blog.likes + 1, updatedBlog.likes)
})

// Cerrar la conexión al finaliar las pruebas
after(async () => {
  await mongoose.connection.close()
})