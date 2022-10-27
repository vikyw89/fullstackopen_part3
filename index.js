const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const { json } = require('express')

app.use(express.static('build'))

app.use(cors())
  
app.use(express.json())

app.use(morgan('tiny', {
    skip: function (tokens, req, res) { return tokens.method === 'POST'}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (tokens, req, res) { return tokens.method !== 'POST'}
}))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        return response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        return response.status(200).send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        `)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                return response.json(person)
            } else {
                return response.status(404).json({
                    error: 'id not found'
                })
            }
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Person
        .findByIdAndUpdate(
            request.params.id,
            { name, number },
            { new: true, runValidators: true, context: 'query' }
        )
        .then(person => {
            if (person) {
                return response.json(person)
            } else {
                return response.status(404).json({
                    error: 'id not found'
                })
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(person => {
            return response.status(204).end()
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person
        .save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
        .catch (error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})