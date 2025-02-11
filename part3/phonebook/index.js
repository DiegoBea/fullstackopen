require('dotenv').config()
const express = require('express')
const uuid = require('uuid')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('dist'))
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['params'] = JSON.stringify(req.body)
    ].join(' ')
  }, {
    skip: function (req, res) {
      return req.method !== 'POST'
    },
  })
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

function generateID(req, res, next) {
  return uuid.v4()
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person =>
    response.json(person)
  )
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined || body.number === undefined) {
    response.status(500).json({ error: 'Incomplete parameters' })
  }

  Person.findOne({ 'name': body.name })
    .then(person => {
      if (!person) {
        person = new Person()
      }

      person.name = body.name
      person.number = body.number

      person.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch((error) => next(error))

      morgan.token('dev', function (req, res) {
        return req.headers['content-type']
      })
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  const options = {
    new: true,
    runValidations: true,
    context: 'query'
  }

  Person.findByIdAndUpdate(request.params.id, person, options)
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    let info =
      '<div>Phonebook has info for ' +
      persons.length +
      ' people<br/>' +
      new Date().toLocaleString() +
      '</div>'
    response.send(info)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') return response.status(400).send({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })


  next(error)
}

app.use(errorHandler)