const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', {username: 1, name: 1, id: 1})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400).end()
    return
  }

  // Get request body
  const body = request.body

  // Get user
  const user = request.user

  // Create blog
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.user.id
  })

  // Save blog
  const savedBlog = await blog.save()

  // Add blog to user
  user.blogs = user.blogs.concat(savedBlog._id)

  // Save blog
  await user.save()

  // Return saved blog
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response, next) => {
  // Find the blog using ID
  const blog = await Blog.findById(request.params.id).populate('user', {id: 1})

  // If the blog does not exist, return error
  if (!blog) return response.status(401).json({error: 'Blog does not exists'})

  // If the blog has no user and userID does not match, return an error
  if (!blog.user || blog.user.id.toString() !== request.user.id.toString()) return response.status(401).json({error: 'Invalid user'})

  await blog.deleteOne()

  // Return code 204
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  // Get body data
  const body = request.body

  // Set blog data
  // TODO: Define data to update
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  // Update data
  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})

  response.json(updated)
})

module.exports = blogsRouter;