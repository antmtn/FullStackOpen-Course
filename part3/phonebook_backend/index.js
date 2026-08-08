require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
      response.json(people)
      })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request,response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    ${date}
    `
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const prevLen = persons.length
  persons = persons.filter((person) => person.id !== id)

  if (prevLen === persons.length)
    response.status(404).send(`Person with id ${id} not found`)
  
  response.status(204).end()
})

app.post('/api/persons', (request, response)=> {
  const id = String(Math.floor(Math.random()*1000) + 5)
  const body = request.body

  if(!body.name || !body.number){
    return response.status(404).send('Name or number missing')
  }
  if(persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())){
    return response.status(404).send('Name already exists in phonebook')
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})