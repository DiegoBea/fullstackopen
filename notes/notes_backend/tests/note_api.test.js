const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    // Delete all notes
    await Note.deleteMany({})
    // Insert notes
    await Note.insertMany(helper.initialNotes)
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
    // Get notes from API
    const response = await api.get('/api/notes')

    // Check if both length are equals
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    // Get all notes
    const response = await api.get('/api/notes')

    // Get all note contents
    const contents = response.body.map(r => r.content)
    // Check if any contents contains 'Browser can execute only JavaScript'
    assert(contents.includes('Browser can execute only JavaScript'))
  })

  describe('viewing a specific note', () => {
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

    test('fails with statuscode 404 if note does not exist', async () => {
      // Generate a non-existing ID
      const validNonexistingId = await helper.nonExistingId()

      // Try to get a note with this ID
      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      // Set random ID
      const invalidId = '5a3d5da59070081a82a3445'

      // Try to get a note with this ID
      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {

    test('a valid note can be added', async () => {
      // Get first user
      const user = (await helper.usersInDb())[0]

      // Create new note data
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: user.id
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
      // Get first user
      const user = (await helper.usersInDb())[0]

      // Create new note data without content
      const newNote = {
        important: true,
        userId: user.id
      }

      // Try to save note using API
      await api.post('/api/notes').send(newNote).expect(400)

      // Get all notes from API
      const notesAtEnd = await helper.notesInDb()

      // Check if notes size is the same as initialNotes length
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {

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
  })
})


// Cerrar la conexión al finaliar las pruebas
after(async () => {
  await mongoose.connection.close()
})