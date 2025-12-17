const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.use( (request, response, next) => {

  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log("-------")
  next()
})

let persons = [
    { 
      id: 1,
      firstName: "Arto Hellas.", 
      phoneNumber: "040-123456"
    },
    { 
      id: 2,
      firstName: "Ada Lovelace", 
      phoneNumber: "39-44-5323523"
    },
    { 
      id: 3,
      firstName: "Dan Abramov", 
      phoneNumber: "12-43-234345"
    },
    { 
      id: 4,
      firstName: "Mary Poppendieck", 
      phoneNumber: "39-23-6423122"
    },
    { 
      id: 5,
      firstName: "Francisco Marquez", 
      phoneNumber: "39-23-6423122"
    }
    ,
    { 
      id: 6,
      firstName: "Francisco Marquez Estteve", 
      phoneNumber: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/info', (request, response) => {
  response.send(
    `<p>PhoneBook has info for  ${persons.length } people  </p>`
    + "<br>"
    + `<p> ${new Date().toUTCString()} </p>`
    )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if (!person)
    {
        console.log("no")
        response.status(404).end()
    }
    else
    {
        console.log("si")
        response.status(200).json(person)
    }

})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    // primero compruebo que existe
    const person = persons.find(person => person.id === id)

    if (!person)
    {
        response.status(404).end()
    }
    else
    {
        persons = persons.filter(person => person.id !== id)
        response.status(200).end()
    }
})

app.post('/api/persons/', (request, response) => {

    const person = request.body

    console.log({person})


    // compruebo que tiene todos los datos
    if (!person.firstName) {
        return response.status(400).json(
        { 
            error: 'You have not entered the registration name' 
        })
    }


    if (!person.phoneNumber) {
        return response.status(400).json(
        { 
            error: 'You have not entered the registration number.' 
        })
    }

    // compruebo que no existe el registro con el nombre
    if (persons.some(p => p.firstName === person.firstName))
    {
        console.log("ready exist..");
        return response.status(401).json(
        { 
            error: 'Ready exist' 
        })
    }


    const ids = persons.map(person => person.id)
    const maxId = ids.length > 0 ? Math.max(...ids) : 0

    const newPerson = {
      "id": maxId+1,
      "firstName": person.firstName, 
      "phoneNumber": person.phoneNumber
    }

    persons = [...persons, newPerson]

    response.status(201).json(newPerson);

})



app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not Found'
  })

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})