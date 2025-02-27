const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

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

  // Set Note objects using initial notes
  const notes = helper.initialNotes.map(note => new Note(note))

  // Generate a promises arrays to execute
  const promisesArray = notes.map(note => note.save())

  // Wait to execute all promises
  await Promise.all(promisesArray)

  // NOTE: Alternative
  /*
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
   */

  // NOTE: This options will be executed after tests because forEach generate his own async operation that 'beforeEach' will not wait for it
  /*helper.initialNotes.forEach(async (note) => {
    // Create new note
    let noteObject = new Note(note)
    // Save new note
    await noteObject.save()
  })*/
})

test.only('notes are returned as json', async () => {
  // Get notes from API
  const response = await api.get('/api/notes')
  // Get all notes
  const contents = response.body.map(element => element.content)
  // Comprobar si en los elementos se encuentra "HTML is easy"
  assert(contents.includes('HTML is easy'))
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, helper.initialNotes.length)
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

test('a valid note can be added', async () => {
  // Create new note data
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  // Create new note in MongoDB
  await api.post('/api/notes').send(newNote).expect(201).expect('Content-type', /application\/json/)

  // Get notes from helper
  const notesAtEnd = await helper.notesInDb()
  // Check if response has same length as initialNotes + 1 (Initial notes + the new one)
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

  // Get all notes contents
  const contents = notesAtEnd.map(note => note.content)
  // Check if notes contents includes the new note content
  assert(contents.includes(newNote.content))
})

test('note without content is not added', async () => {
  // Create new note data without content
  const newNote = {
    important: true
  }

  // Try to save note using API
  await api.post('/api/notes').send(newNote).expect(400)

  // Get all notes from API
  const notesAtEnd = await helper.notesInDb()

  // Check if notes size is the same as initialNotes length
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  // Get notes in ddbb
  const notesAtStart = await helper.notesInDb()

  // Get first note
  const noteToView = notesAtStart[0]

  // Search note by first note ID
  const resultNote = await api.get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-type', /application\/json/)

  // Check if first note is equals to searched by ID
  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
  // Get all notes in DB
  const notesAtStart = await helper.notesInDb()
  // Get first note
  const firstNote = notesAtStart[0]
  // Delete note
  await api.delete(`/api/notes/${firstNote.id}`).expect(204)
  // Get all notes after delete the note
  const notesAtEnd = await helper.notesInDb()
  // Get contents of all notes
  const contents = notesAtEnd.map(element => element.content)

  // Check if contents NOT contains first note content
  assert(!contents.includes(firstNote.content))
  // Check if length has one less
  assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
})

// Cerrar la conexión al finaliar las pruebas
after(async () => {
  await mongoose.connection.close()
})