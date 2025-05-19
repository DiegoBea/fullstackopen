const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  // Extract username and password from the body
  const { username, password } = request.body

  // Find user using username
  const user = await User.findOne({ username })

  // Check if the password is correct (First check if the user exists)
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // If something fails, return error 401
  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invaid username or password'
    })
  }

  // Create a model to create a token
  const userForToken = {
    username: user.username,
    id: user._id
  }

  // SIGN token with user and secret key
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 } // Expire in 1 hour
  )

  response.status(200).send({
    token,
    username: username,
    name: user.name
  })
})

module.exports = loginRouter