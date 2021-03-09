const { request, response } = require("express");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");

const Contact = require("./models/note");
const e = require("express");

morgan.token("request-body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :response-time ms :request-body"));

app.use(express.static(path.join(__dirname, "..", "front", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "front", "build", "index.html"));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

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
  const persons = [];
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      persons.push(contact);
    });
    response.json(persons);
    console.log(persons);
    mongoose.connection.close();
  });
});

app.get("/info", (request, response) => {
  // const personsLength = persons.length;
  // const date = new Date();
  // const message = `Phonebook has info for ${personsLength} people
  // ${date}`;
  // response.status(200).send(message);
  Contact.find({}).then((result) => {
    console.log("phonebook");
    result.forEach((contact) => {
      console.log(contact.name, contact.phoneNumber);
    });
    mongoose.connection.close();
  });
});

app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
  // const id = Number(request.params.id);
  // const person = persons.filter((person) => person.id === id);
  // response.status(200).json(person[0]);
});

app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // response.status(200).json(persons);
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }
  const person = new Contact({
    name: body.name,
    phoneNumber: body.number,
  });
  person
    .save()
    .then((savedNote) => {
      return savedNote.toJSON();
    })
    .then((savedAndFormattedNote) => {
      response.json(savedAndFormattedNote);
    })
    .catch((error) => next(error));
});
// const id = idGenerator();
// const body = request.body;
// if (!request.body.name) {
//   return response.status(400).json({ error: "must enter a name" });
// } else if (!request.body.number) {
//   return response.status(400).json({ error: "must enter a number" });
// }
// if (!isNameDuplicated(body.name, persons)) {
//   return response.status(400).json({ error: "name must be unique" });
// }
// //   isNameDuplicated(body.name, persons);
// const person = [
//   {
//     id: id,
//     name: body.name,
//     number: body.number,
//   },
// ];
// persons = persons.concat(person);
// response.status(200).json(person[0]);

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = new Contact({
    name: body.name,
    phoneNumber: body.phoneNumber,
  });
  const newNumber = { phoneNumber: person.phoneNumber };
  console.log(newNumber);
  Contact.findByIdAndUpdate(request.params.id, newNumber)
    .then((updatedNote) => {
      // console.log(updatedNote);
      response.json(updatedNote);
    })
    .catch((error) => next(error));
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
