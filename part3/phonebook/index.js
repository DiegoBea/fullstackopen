require('dotenv').config()
const express = require("express");
const uuid = require("uuid");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person")

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
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
      return req.method != "POST";
    },
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

function generateID(req, res, next) {
  return uuid.v4();
}

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person =>
    response.json(person)
  )
});

app.delete("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  let person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).json({
      error: "Person not found",
    });
  }

  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (body.name === undefined || body.number === undefined) {
    response.status(500).json({ error: "Incomplete parameters" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  morgan.token("dev", function (req, res) {
    return req.headers["content-type"];
  });
});

app.get("/info", (request, response) => {
  let info =
    "<div>Phonebook has info for " +
    persons.length +
    " people<br/>" +
    new Date().toLocaleString() +
    "</div>";
  response.send(info);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
