const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  // Get find all notes
  let notes = await Note.find({})
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

  // Create new note with body values
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  // Save note
  const savedNote = await note.save()
  // Return note saved
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  // Find note using ID in URL
  const note = await Note.findById(request.params.id)
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