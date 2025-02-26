const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  // Delete all notes
  await Note.deleteMany({})
  // Create new note using first element in initialNotes
  let noteObject = new Note(initialNotes[0])
  // Save new note
  await noteObject.save()
  // Create new note using second element in initialNotes
  noteObject = new Note(initialNotes[1])
  // Save second note
  await noteObject.save()
})

test.only('notes are returned as json', async () => {
  // Get notes from API
  const response = await api.get('/api/notes')
  // Get all notes
  const contents = response.body.map(element => element.content)
  // Comprobar si en los elementos se encuentra "HTML is easy"
  assert(contents.includes('HTML is easy'))
})

test.only('there are two notes', async () => {
  // Get notes from API
  const response = await api.get('/api/notes')
  // Check if response length is equals to initialNotes length
  assert.strictEqual(response.body.length, initialNotes.length)
  // assert.strictEqual(response.body.length, 2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

// Cerrar la conexión al finaliar las pruebas
after(async () => {
  await mongoose.connection.close()
})