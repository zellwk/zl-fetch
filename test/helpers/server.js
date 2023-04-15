import bodyParser from 'body-parser'
import express from 'express'
import querystring from 'querystring'

const app = express()

// ========================
// Middlewares
// ========================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// ========================
// Routes
// ========================
app.get('/', (req, res) => {
  res.json('Hello World')
})

// For testing createZlFetch
app.get('/createZlFetch', (req, res) => {
  res.json('Hello World')
})

app.delete('/createZlFetch', (req, res) => {
  res.json('Hello World')
})

app.use('/createZlFetch', (req, res) => {
  res.json(req.body)
})

// Returns the req.body
app.use('/body', (req, res) => {
  res.json(req.body)
})

// Returns the queries
app.use('/queries', (req, res) => {
  res.json(req.query)
})

// JSON
app.use('/json', (req, res) => {
  res.json({ key: 'value' })
})

app.use('/json-error', (req, res) => {
  res.status(400).json({ message: 'An error message' })
})

// Text
app.use('/text', (req, res) => {
  res.send('A paragraph of text')
})

app.use('/text-error', (req, res) => {
  res.status(400).send('An error message')
})

// x-www-form-urlencoded
app.use('/x-www-form-urlencoded', (req, res) => {
  res.format({
    'application/x-www-form-urlencoded'() {
      const data = { message: 'Error message' }
      res.send(querystring.encode(data))
    },
  })
})

// Forms
app.use('/forms', (req, res) => {
  res.send(req.body)
})

app.use('/forms-error', (req, res) => {
  res.status(400).send('An error message')
})

export default app
