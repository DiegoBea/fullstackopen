const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')

usersRouter.get('/', async (request, response) => {
  // Get user and his notes
  const user = await User.find({})
    // Get user notes info and the desired fields (using "1" value)
    .populate('notes', { content: 1, important: 1 })

  return response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter