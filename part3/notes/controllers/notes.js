const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  // Get find all notes
  let notes = await Note.find({})
  // Return json with all notes
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  // Find note using ID in URL
  Note.findById(request.params.id)
    .then(note => {
      // If there is a note, return it, if not, return 404 error code
      note ? response.json(note) : response.status(404).end()
    })
    .catch(error => next(error))
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

notesRouter.delete('/:id', (request, response, next) => {
  // Find note using ID in URL
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      // Return status 204
      response.status(204).end()
    })
    .catch(error => next(error))
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