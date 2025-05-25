const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  // Get authorization
  const auth = request.get('authorization')

  // Check if auth exists and starts with 'Bearer'
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '')
  }

  // Move to next middleware
  next()
}

const userExtractor = async (request, response, next) => {
  // Get auth
  const auth = request.token

  if (!auth) {
    return response.status(401).json({error: 'Missing auth token'})
  }

  // Extract data
  const decodedData = jwt.verify(auth, process.env.SECRET)

  // If there is no id in decoded data, go to the next middleware
  if (!decodedData.id) {
    return response.status(401).json({error: 'Invalid user'})
  }

  // Get user
  const user = await User.findById(decodedData.id)

  // If the user is found, add to the request
  if (!user) {
    return response.status(401).json({error: 'User does not exists'})
  }

  request.user = user

  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}