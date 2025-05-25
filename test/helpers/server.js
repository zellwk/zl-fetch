import { createSSE } from '@splendidlabz/utils'
import bodyParser from 'body-parser'
import express from 'express'
import querystring from 'querystring'

const app = express()

// ========================
// Middlewares
// ========================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})
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

// Streaming 

app.get('/stream-sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  let count = 0
  const interval = setInterval(() => {
    count++
    
    // SSE format: data: message\n\n
    res.write(createSSE({
      data: { chunk: count, message: new Date().toLocaleTimeString()}
    }))
    
    // You can also send different event types
    if (count % 3 === 0) {
      res.write(`event: status\ndata: Status update at ${count}\n\n`)
    }
    
    if (count >= 10) {
      // Send termination event before closing
      res.write(createSSE({
        event: 'close',
        data: { 
          message: 'Stream complete',
          totalChunks: count,
          timestamp: new Date().toISOString()
        }
      }))
      
      // Clear interval and end response
      clearInterval(interval)
      res.end()
    }
  }, 100)

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval)
    // Send a final message if the client disconnects
    if (!res.writableEnded) {
      res.write(createSSE({
        event: 'error',
        data: { message: 'Client disconnected' }
      }))
      res.end()
    }
  })

  // Handle errors
  req.on('error', (error) => {
    clearInterval(interval)
    if (!res.writableEnded) {
      res.write(createSSE({
        event: 'error',
        data: { message: error.message }
      }))
      res.end()
    }
  })
})

// Chunked transfer endpoint
app.get('/stream-chunked', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Transfer-Encoding', 'chunked')
  
  let count = 0
  const interval = setInterval(() => {
    count++
    const message = `Chunk ${count}: ${new Date().toLocaleTimeString()}\n`
    
    // Express handles the chunked encoding automatically
    res.write(message)
    
    if (count >= 10) {
      clearInterval(interval)
      res.end()
    }
  }, 100)

  req.on('close', () => {
    clearInterval(interval)
  })
})

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  
  let count = 0
  const interval = setInterval(() => {
    count++
    const message = `Chunk ${count}: ${new Date().toLocaleTimeString()}`
    
    // Express handles the chunked encoding automatically
    res.write(message)
    
    if (count >= 10) {
      clearInterval(interval)
      res.end()
    }
  }, 100)

  req.on('close', () => {
    clearInterval(interval)
  })
})

export default app
