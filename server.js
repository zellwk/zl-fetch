import { createSSE } from '@splendidlabz/utils'
import bodyParser from 'body-parser'
import express from 'express'

const app = express()

// ========================
// Middlewares
// ========================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  // Allow specific origins
  const origin = req.headers.origin
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  // For preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.status(200).end()
    return
  }
  
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

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

    // res.write('data: Chunk ' + count + ': ' + new Date().toLocaleTimeString() + '\n\n')
    
    // You can also send different event types
    if (count % 3 === 0) {
      res.write(`event: status\ndata: Status update at ${count}\n\n`)
    }
    
    if (count >= 10) {
      clearInterval(interval)
      res.end()
    }

    // if (count >= 10) {
    //   // Send termination event
    //   res.write(createSSE({
    //     event: 'close',
    //     data: { message: 'Stream complete' }
    //   }))
    //   clearInterval(interval)
    //   res.end()
    // }
  }, 1000)

  req.on('close', () => {
    clearInterval(interval)
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
  }, 1000)

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
  }, 1000)

  req.on('close', () => {
    clearInterval(interval)
  })
})

// In a real app, use a proper database like MongoDB, PostgreSQL, etc.
// This is a simplified in-memory store for demonstration
const conversations = new Map()
const activeStreams = new Map()

// Helper to generate IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Conversation management
class ConversationStore {
  constructor() {
    this.conversations = new Map()
    this.pendingUpdates = new Map() // Store pending updates
    this.updateTimeouts = new Map() // Store update timeouts
  }

  createConversation(userId, initialPrompt) {
    const conversationId = generateId()
    const conversation = {
      id: conversationId,
      userId,
      messages: [{
        role: 'user',
        content: initialPrompt,
        timestamp: Date.now()
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    this.conversations.set(conversationId, conversation)
    return conversation
  }

  addMessage(conversationId, role, content) {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return null

    const message = {
      role,
      content,
      timestamp: Date.now()
    }
    
    conversation.messages.push(message)
    conversation.updatedAt = Date.now()
    return message
  }

  getConversation(conversationId) {
    return this.conversations.get(conversationId)
  }

  getConversationsByUser(userId) {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
  }

  deleteConversation(conversationId) {
    this.conversations.delete(conversationId)
  }

  // Add a pending update that will be batched
  addPendingUpdate(conversationId, role, content) {
    const key = `${conversationId}-${role}`
    const now = Date.now()
    
    // Get or create pending update
    if (!this.pendingUpdates.has(key)) {
      this.pendingUpdates.set(key, {
        conversationId,
        role,
        content,
        lastUpdate: now,
        isComplete: false
      })
    } else {
      // Update existing pending update
      const update = this.pendingUpdates.get(key)
      update.content = content
      update.lastUpdate = now
    }

    // Clear existing timeout
    if (this.updateTimeouts.has(key)) {
      clearTimeout(this.updateTimeouts.get(key))
    }

    // Set new timeout for batched update
    const timeout = setTimeout(() => {
      this.flushPendingUpdate(key)
    }, 1000) // Batch updates within 1 second

    this.updateTimeouts.set(key, timeout)
  }

  // Mark a pending update as complete
  markUpdateComplete(conversationId, role) {
    const key = `${conversationId}-${role}`
    const update = this.pendingUpdates.get(key)
    
    if (update) {
      update.isComplete = true
      this.flushPendingUpdate(key)
    }
  }

  // Flush a pending update to the conversation
  flushPendingUpdate(key) {
    const update = this.pendingUpdates.get(key)
    if (!update) return

    const conversation = this.conversations.get(update.conversationId)
    if (!conversation) return

    // Find the last message of this role
    const lastMessageIndex = conversation.messages
      .map((msg, index) => ({ msg, index }))
      .filter(({ msg }) => msg.role === update.role)
      .pop()?.index

    if (lastMessageIndex !== undefined) {
      // Update existing message
      conversation.messages[lastMessageIndex].content = update.content
      conversation.messages[lastMessageIndex].isComplete = update.isComplete
    } else {
      // Add new message
      conversation.messages.push({
        role: update.role,
        content: update.content,
        timestamp: Date.now(),
        isComplete: update.isComplete
      })
    }

    conversation.updatedAt = Date.now()
    
    // Clean up
    this.pendingUpdates.delete(key)
    this.updateTimeouts.delete(key)
  }

  // Clean up any pending updates for a conversation
  cleanupPendingUpdates(conversationId) {
    const keys = Array.from(this.pendingUpdates.keys())
      .filter(key => key.startsWith(`${conversationId}-`))
    
    keys.forEach(key => {
      const update = this.pendingUpdates.get(key)
      if (update) {
        update.isComplete = true
        this.flushPendingUpdate(key)
      }
    })
  }
}

const conversationStore = new ConversationStore()

// Add authentication middleware
const authenticate = (req, res, next) => {
  // Get token from query parameter (for SSE) or header (for Fetch)
  const token = req.query.token || req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }
  
  // Verify token (simplified example)
  if (token !== 'valid-token') {
    res.status(401).json({ error: 'Invalid token' })
    return
  }
  
  next()
}

// Update init-stream endpoint to create conversation
app.post('/init-stream', authenticate, async (req, res) => {
  const { prompt, conversationId } = req.body
  const userId = req.user.id // Assuming auth middleware adds user info
  
  let conversation
  if (conversationId) {
    // Continue existing conversation
    conversation = conversationStore.getConversation(conversationId)
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' })
      return
    }
    // Add user message to existing conversation
    conversationStore.addMessage(conversationId, 'user', prompt)
  } else {
    // Start new conversation
    conversation = conversationStore.createConversation(userId, prompt)
  }
  
  const streamId = generateId()
  
  // Store stream data
  activeStreams.set(streamId, {
    streamId,
    conversationId: conversation.id,
    cancelled: false,
    response: null,
    interval: null
  })
  
  res.json({ 
    streamId,
    conversationId: conversation.id
  })
})

// Update stream endpoint to use batched updates
app.get('/stream/:streamId', authenticate, (req, res) => {
  const { streamId } = req.params
  const streamData = activeStreams.get(streamId)
  
  if (!streamData) {
    res.status(404).json({ error: 'Stream not found' })
    return
  }

  const conversation = conversationStore.getConversation(streamData.conversationId)
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' })
    return
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  // Add CORS headers
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  streamData.response = res
  let currentResponse = ''

  const interval = setInterval(() => {
    if (streamData.cancelled) {
      // Mark the update as complete when cancelled
      conversationStore.markUpdateComplete(conversation.id, 'assistant')
      clearInterval(interval)
      return
    }

    // Simulate AI response chunk
    const chunk = `Chunk ${Date.now()}`
    currentResponse += chunk
    
    // Add pending update (will be batched)
    conversationStore.addPendingUpdate(
      conversation.id,
      'assistant',
      currentResponse
    )
    
    res.write(`data: ${JSON.stringify({ 
      message: chunk,
      conversationId: conversation.id,
      timestamp: Date.now()
    })}\n\n`)
    
    // Simulate completion after 5 chunks
    if (currentResponse.length > 100) {
      clearInterval(interval)
      if (!streamData.cancelled) {
        // Mark the update as complete
        conversationStore.markUpdateComplete(conversation.id, 'assistant')
        
        res.write(`data: ${JSON.stringify({ 
          done: true,
          conversationId: conversation.id,
          finalMessage: currentResponse
        })}\n\n`)
      }
      res.end()
      activeStreams.delete(streamId)
    }
  }, 1000)

  streamData.interval = interval

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval)
    // Mark any pending updates as complete
    conversationStore.cleanupPendingUpdates(conversation.id)
    activeStreams.delete(streamId)
  })
})

// Add endpoints for conversation management
app.get('/conversations', authenticate, (req, res) => {
  const userId = req.user.id
  const conversations = conversationStore.getConversationsByUser(userId)
  res.json({ conversations })
})

app.get('/conversations/:conversationId', authenticate, (req, res) => {
  const { conversationId } = req.params
  const conversation = conversationStore.getConversation(conversationId)
  
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' })
    return
  }
  
  res.json({ conversation })
})

app.delete('/conversations/:conversationId', authenticate, (req, res) => {
  const { conversationId } = req.params
  conversationStore.deleteConversation(conversationId)
  res.json({ success: true })
})

// Optional: Endpoint to list active streams
app.get('/active-streams', (req, res) => {
  const { conversationId } = req.query
  
  const streams = Array.from(activeStreams.entries())
    .filter(([_, data]) => !conversationId || data.conversationId === conversationId)
    .map(([id, data]) => ({
      streamId: id,
      conversationId: data.conversationId,
      prompt: data.prompt,
      messageCount: data.messages.length,
      createdAt: data.createdAt
    }))
  
  res.json({ streams })
})

// Update stop endpoint to handle pending updates
app.post('/stream/:streamId/stop', authenticate, (req, res) => {
  const { streamId } = req.params
  const streamData = activeStreams.get(streamId)
  
  if (!streamData) {
    res.status(404).json({ error: 'Stream not found' })
    return
  }

  // Signal cancellation
  streamData.cancelled = true
  
  // Mark any pending updates as complete
  conversationStore.cleanupPendingUpdates(streamData.conversationId)
  
  // Send final message to client
  if (streamData.response) {
    streamData.response.write(`data: ${JSON.stringify({ 
      cancelled: true,
      message: 'Stream cancelled by user'
    })}\n\n`)
    streamData.response.end()
  }

  // Clean up
  if (streamData.interval) {
    clearInterval(streamData.interval)
  }
  activeStreams.delete(streamId)
  
  res.json({ success: true })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

export default app
