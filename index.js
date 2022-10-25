const express = require('express')
const app = express()
var morgan = require('morgan')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
app.use(express.json())
app.use(morgan('tiny', {
    skip: function (tokens, req, res) { return tokens.method === 'POST'}
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (tokens, req, res) { return tokens.method !== 'POST'}
}))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 999)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if ((!body.name) || (!body.number)) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        time: new Date(),
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})