const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400).end()
    return
  }

  const blog = new Blog(request.body)

  const result = await blog.save()

  response.status(201).json(result)

})

blogsRouter.delete('/:id', async (request, response, next) => {
  // Find blog and delete using ID 
  await Blog.findByIdAndDelete(request.params.id)

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
  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(updated)
})

module.exports = blogsRouter;