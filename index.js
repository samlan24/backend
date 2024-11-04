const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors({
    origin: 'https://full-stack-development-g1gc.vercel.app'
}));

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let people = [
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

app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p> Phonebook has info for ${people.length} people</p> <br> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = people.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    people = people.filter(person => person.id !== id)

    res.status(204).end()
})

const generateID = () => {
    let id;
    const idRange = 1000000;
    const existingIds = people.map(person => person.id)

    do {
        id = Math.floor(Math.random() * idRange) + 1;
    } while (existingIds.includes(id));

    return String(id);
}

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    if (people.find(person => person.name === name)) {
        return res.status(400).json({ error: 'Name already exists in the phonebook' });
    }

    const newPerson = {
        id: generateID(),
        name,
        number
    };

    people = people.concat(newPerson);
    res.status(201).json(newPerson);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})