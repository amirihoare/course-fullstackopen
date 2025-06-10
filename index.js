const express = require('express')
const app = express()
const morgan = require('morgan')
const PORT = 3001

morgan.token('body', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(express.json())
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
    response.json(persons)
})

app.get('/info', (request, response) => {
    const totalPersons = persons.length
    const currentTime = new Date()
    
    const html = `
    <div>
    <p>Phonebook has info for ${totalPersons} people</p>
    <p>${currentTime}</p>
    </div>`
    
    response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)
    }else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    // validation: Check for missing fields
    if (!name || !number) {
        return response.status(400).json({ error: 'Name and number are required' })
    }

    // validation: Check for uniqueness
    const nameExists = persons.some(person => person.name.toLowerCase() === name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({ error: 'Name must be unique' })
    }

    // ID generation
    const id = Math.floor(Math.random() * 1000000).toString()

    const newPerson = {
        id,
        name,
        number
    }

    persons = persons.concat(newPerson)
    response.status(201).json(newPerson)
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})