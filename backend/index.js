const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
morgan.token("request-body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :response-time ms :request-body"));

let persons = [
  {
    id: 1,
    name: "Ophir",
    number: "054-2655475",
  },
  {
    id: 2,
    name: "Eran",
    number: "054-2654673",
  },
  {
    id: 3,
    name: "Nadav",
    number: "054-2657829",
  },
];

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});

app.get("/info", (request, response) => {
  const personsLength = persons.length;
  const date = new Date();
  const message = `Phonebook has info for ${personsLength} people 
  ${date}`;
  response.status(200).send(message);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id === id);
  response.status(200).json(person[0]);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(200).json(persons);
});

app.post("/api/persons/", (request, response) => {
  const id = idGenerator();
  const body = request.body;
  if (!request.body.name) {
    return response.status(400).json({ error: "must enter a name" });
  } else if (!request.body.number) {
    return response.status(400).json({ error: "must enter a number" });
  }
  if (!isNameDuplicated(body.name, persons)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  //   isNameDuplicated(body.name, persons);
  const person = [
    {
      id: id,
      name: body.name,
      number: body.number,
    },
  ];
  persons = persons.concat(person);
  response.status(200).json(person[0]);
});

function idGenerator() {
  let id = "";
  for (let i = 0; i < 9; i++) {
    const number = Math.floor(Math.random() * 10);
    id += number;
  }
  return Number(id);
}

function isNameDuplicated(name, persons) {
  const filtered = persons.filter((person) => person.name === name);
  if (filtered[0] === undefined) {
    return true;
  } else {
    return false;
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
