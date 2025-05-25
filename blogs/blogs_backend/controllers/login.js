const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const tokenExpiration = 1

loginRouter.post('/', async (request, response) => {
  // Extract username and password from the body
  const {username, password} = request.body
  // Find user using username
  const user = await User.findOne({username})
  // Check if the password is correct (First check if the user exists)
  const isCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  // If something fails, return error 401
  if (!user || !isCorrect) {
    return response.status(401).json({
      error: 'Invalid credentials'
    })
  }
  // Create a model with username and id to create a token
  const userForToken = {
    username: username,
    id: user._id
  }
  // SIGN token with user and secret key
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {expiresIn: tokenExpiration * 60 * 60})

  // Return token, username and name
  response.status(200)
    .send({
      token,
      username: username,
      name: user.name
    })
})

module.exports = loginRouter