const express = require("express");
const uuid = require("uuid");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  let person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).json({
      error: "Person not found",
    });
  }
  response.status(200).json(person);
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
  if (body.name === undefined || body.phone === undefined) {
    response.status(500).json({ error: "Incomplete parameters" });
  }

  if (persons.some((persons) => persons.name === body.name)) {
    response.status(500).json({ error: "Name must be unique" });
  }

  body.id = generateID();

  persons = persons.concat(body);
  response.status(200).json(body);
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
