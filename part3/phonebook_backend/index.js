require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
let persons =
[
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]


app.use(cors())

app.use(express.json())

morgan.token('body',req => {
  if (req.method==='POST'){
    return JSON.stringify(req.body)
  }

  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const len = persons.length
  const date = new Date().toString()

  response.send(
    `
        <p>Phonebook has info for ${len} people</p>
        <p>${date}</p>
        `
  )
})

app.get('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })

})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(
      () => {
        response.status(204).end()
      }
    )
    .catch(
      error => {
        next(error)
      }
    )
})



app.post('/api/persons', (request, response,next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  // if (persons.some(p=> p.name === body.name)){
  //     return response.status(400).json({
  //         error: 'name must be unique'
  //     })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(
    error => next(error)
  )

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }
  Person.findById(id).then(
    result => {
      if(result){
        result.name = body.name
        result.number = body.number
        return result.save().then(updatedPerson => {
          response.json(updatedPerson)
        })
      }else{
        return response.status(404).end()
      }
    }
  ).catch(
    error => next(error)
  )



})



//error handling middlewares

const CasterrorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)
app.use(CasterrorHandler)

//server
const PORT = process.env.PORT||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})