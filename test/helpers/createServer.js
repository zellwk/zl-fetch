const bodyParser = require('body-parser')
const express = require('express')
const app = express()

// ========================
// Middlewares
// ========================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// ========================
// Routes
// ========================
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

// Forms
app.use('/forms', (req, res) => {
  res.send(req.body)
})

app.use('/forms-error', (req, res) => {
  res.status(400).send('An error message')
})

module.exports = app
