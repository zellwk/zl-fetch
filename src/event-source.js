import { parseJSON } from '@splendidlabz/utils'
import zlFetch from './index.js'

/**
 * Creates an EventSource connection with automatic JSON parsing and event handling.
 * Works in both browser and Node.js environments with consistent behavior.
 *
 * EventSource automatically handles reconnection:
 * - Default retry interval is 3 seconds
 * - Server can override retry interval by sending `retry: <milliseconds>`
 * - Retry interval persists until changed by server or connection is closed
 *
 * @param {string} url - The URL to connect to for the EventSource
 * @param {Object} options - Configuration options
 * @param {number} [options.retry=3000] - Default retry interval in milliseconds (Node.js only)
 * @param {Function} [options.message] - Callback for 'message' events. Receives parsed JSON data or raw text if parsing fails
 * @param {Function} [options.open] - Callback for 'open' events. Receives the Event object
 * @param {Function} [options.error] - Callback for 'error' events. Receives parsed JSON data or raw text if parsing fails
 * @param {Function} [options.close] - Callback for 'close' events. Called when the connection is closed
 * @param {Function} [options.*] - Callbacks for any custom events. Each callback receives parsed JSON data or raw text if parsing fails
 * @returns {EventSource|Promise<ReadableStream>} In browser: EventSource instance that can be used to close the connection. In Node.js: Promise that resolves to a ReadableStream
 *
 * @example
 * // Basic usage with standard events
 * const source = zlEventSource('http://localhost:3000/stream', {
 *   message: (data) => console.log('Message:', data),
 *   open: () => console.log('Connected'),
 *   error: (error) => console.log('Error:', error),
 *   close: () => console.log('Connection closed')
 * })
 *
 * // Close connection when done (browser only)
 * source.close()
 *
 * @example
 * // With custom events
 * zlEventSource('http://localhost:3000/stream', {
 *   status: (data) => console.log('Status:', data),
 *   update: (data) => console.log('Update:', data)
 * })
 *
 * @example
 * // Node.js usage with custom retry interval
 * const stream = await zlEventSource('http://localhost:3000/stream', {
 *   retry: 5000, // 5 second retry interval
 *   message: (data) => console.log('Message:', data)
 * })
 */
export function zlEventSource(url, options) {
  if (typeof EventSource === 'undefined') return zlNodeEventSource(url, options)
  return browserEventSource(url, options)
}

/**
 * Creates an EventSource connection in the browser environment.
 * Uses the native EventSource API with automatic JSON parsing.
 *
 * @private
 * @param {string} url - The URL to connect to for the EventSource
 * @param {Object} options - Configuration options containing event callbacks
 * @param {Object} options.callbacks - Object containing event name to callback function mappings
 * @returns {EventSource} The EventSource instance that can be used to close the connection
 */
function browserEventSource(url, { close, ...callbacks } = {}) {
  const evtSrc = new EventSource(url)
  const listeners = new Map()

  // Set up event handlers using addEventListener
  for (const [event, callback] of Object.entries(callbacks)) {
    const handler = event => {
      const data = parseJSON(event.data)
      callback(data)
    }
    evtSrc.addEventListener(event, handler)
    listeners.set(event, handler)
  }

  // Handle close event
  evtSrc.addEventListener('close', (event) => {
    const data = parseJSON(event.data)

    // Remove all registered listeners
    for (const [event, handler] of listeners) {
      evtSrc.removeEventListener(event, handler)
    }
    listeners.clear()

    // Actually close the connection
    evtSrc.close()

    // Call the close callback if provided
    if (close) close(data)
  })

  return evtSrc
}

/**
 * Creates an EventSource connection in the Node.js environment.
 * Uses zlFetch to handle the connection and stream processing.
 *
 * @private
 * @param {string} url - The URL to connect to for the EventSource
 * @param {Object} options - Configuration options
 * @param {number} [options.retry=3000] - Default retry interval in milliseconds
 * @param {Object} options.callbacks - Object containing event name to callback function mappings
 * @returns {Promise<ReadableStream>} Promise that resolves to a ReadableStream for the SSE connection
 */
function zlNodeEventSource(url, { retry = 3000, ...callbacks } = {}) {
  let shouldStop = false
  let stream

  const evtSource = connect()
  evtSource.close = () => {
    shouldStop = true
    stream.abort()
  }

  async function connect() {
    stream = zlFetch(url)
    
    return stream
      .then(async stream => {
        for await (const chunk of stream.body) {
          if (shouldStop) break
          const cb = callbacks[chunk.event]
          if (cb) cb(chunk.data)
          if (chunk.event === 'close') evtSource.close()
        }
      })
      .catch(error => {
        const cb = callbacks.error
        if (cb) cb(error)
        if (!shouldStop) {
          return setTimeout(connect, retry)
        }
      })
  }

  return evtSource
}
