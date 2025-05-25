const UsersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

UsersRouter.get('/', async (request, response) => {
  // Get all users with his blogs
  const users = await User.find({})
    .populate('blogs', {url: 1, title: 1, author: 1, id: 1})

  response.json(users)
})

UsersRouter.post('/', async (request, response) => {
  // Get values from the request body
  const {username, name, password} = request.body

  if (password.length < 3) return response.status(401).json({error: 'Password must have at least 3 characters'})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = UsersRouter