const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  // Get all notes and user data
  const notes = await Note.find({})
  // Get note user data (only username and name)
    .populate('user', {username: 1, name: 1})
  // Return json with all notes
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  // Find note using ID in URL
  const note = await Note.findById(request.params.id)
  // If there is a note, return it, if not, return 404 error code
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  // Get note user
  const user = await User.findById(body.userId)

  // Create new note with body values
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })
  // Save note
  const savedNote = await note.save()

  // Add note to user
  user.notes = user.notes.concat(savedNote._id)
  // Save user
  await user.save()

  // Return note saved
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  // Find note using ID in URL
  const note = await Note.findByIdAndDelete(request.params.id)
  // Return code 204
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  // Create note using body values
  const note = {
    content: body.content,
    important: body.important,
  }

  // Find note using ID and update it
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter