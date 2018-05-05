const express = require('express')
const app = express()

app.use('/json', (req, res) => res.json({ 'key': 'value' }))
app.use('/json-error', (req, res) =>
  res.status(400).json({ 'err': 'some message' }))

app.use('/text', (req, res) => res.send('booyah!'))
app.use('/text-error', (req, res) =>
  res.status(400).send('username required'))

let server
exports.before = async t => (server = await app.listen(3000))
exports.after = async t => server.close()
