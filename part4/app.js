const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const Blog = require('./models/blog')
const config = require('./utils/config')
const logger = require("./utils/logger")
const blogsRouter = require("./controllers/blogs")

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter);

module.exports = app;