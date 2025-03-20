const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  // Create tmp note
  const note = new Note({ content: 'willremovethissoon' })
  // Save note in database
  await note.save()
  // Delete the note
  await note.deleteOne()

  // Get the removed note ID
  return note._id.toString()
}

const notesInDb = async () => {
  // Request all notes to API
  const notes = await Note.find({})
  // Return notes in formatted to JSON
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}