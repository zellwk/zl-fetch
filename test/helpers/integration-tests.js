import { describe, expect, it } from 'vitest'

import { getBtoa } from '../../src/createRequestOptions.js'
import { zlEventSource } from '../../src/event-source.js'
import { toQueryString } from '../../src/util.js'

export default function tests(environment, config) {
  const { zlFetch, createZlFetch, readStream } = config

  // ========================
  // Basic zlFetch
  // ========================
  describe(`Sending Requests (from ${environment})`, context => {
    it('Simple GET request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}`)
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Simple POST request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/body`, {
        method: 'post',
        body: { message: 'good game' },
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('Simple PUT request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/body`, {
        method: 'put',
        body: { message: 'good game' },
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('GET requests with queries', async ({ endpoint }) => {
      const { response } = await zlFetch(`${endpoint}/queries`, {
        queries: {
          normal: 'normal',
          toEncode: 'http://google.com',
        },
      })
      const url = response.url
      expect(url).toMatch(/\?/)

      const queries = url.split('?')[1].split('&')
      expect(queries[0]).toBe('normal=normal')
      expect(queries[1]).toBe('toEncode=http%3A%2F%2Fgoogle.com')
    })

    it('GET requests with query', async ({ endpoint }) => {
      const { response } = await zlFetch(`${endpoint}/queries`, {
        query: {
          normal: 'normal',
          toEncode: 'http://google.com',
        },
      })
      const url = response.url
      expect(url).toMatch(/\?/)

      const queries = url.split('?')[1].split('&')
      expect(queries[0]).toBe('normal=normal')
      expect(queries[1]).toBe('toEncode=http%3A%2F%2Fgoogle.com')
    })

    it('POST explicit content-type: application/json', async ({ endpoint }) => {
      // This one should fail because the body is not an object
      const { response, error } = await zlFetch(`${endpoint}/body`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: toQueryString({ message: 'good game' }),
        returnError: true,
      })

      expect(response).toBe(null)
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body.message).toContain(/SyntaxError: Unexpected token/)
    })

    it('POST with x-www-form-urlencoded data', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/body`, {
        method: 'post',
        body: toQueryString({ message: 'good game' }),
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('POST explicit content-type: x-www-form-urlencoded', async ({
      endpoint,
    }) => {
      // This one will send "fail" because the body is not a query string.
      // It will not return an error in this test because of how we configured the backend. But the data will be `object Object: ''` instead of `message=good+game`
      const { response, error, debug } = await zlFetch(`${endpoint}/body`, {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: { message: 'good game' },
        returnError: true,
        debug: true,
      })

      // This is just how we have configured our backend
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ 'object Object': '' })
      expect(debug.body).toEqual({ message: 'good game' })
    })

    it.todo('POST with Form Data')
    it.todo(`POST with Content Type set to 'x-www-form-urlencoded`)
  })

  // ========================
  // Aborting Requests
  // ========================
  describe(`Aborting Requests (from ${environment})`, context => {
    it('Can abort via promises', async ({ endpoint }) => {
      const request = zlFetch(`${endpoint}/stream-sse`)

      // Aborts request
      request.abort()
      request.catch(err => {
        expect(err.name).toBe('AbortError')
      })

      // Ends the test
      return Promise.resolve()
    })

    it('Can abort in then', async ({ endpoint }) => {
      return zlFetch(`${endpoint}/stream-sse`)
        .then(response => {
          response.abort()
        })
        .catch(err => {
          expect(err.name).toBe('AbortError')
        })
    })

    it('Can abort via async/await', async ({ endpoint }) => {
      try {
        const request = await zlFetch(`${endpoint}/stream-sse`)
        request.abort()
      } catch (err) {
        expect(err.name).toBe('AbortError')
      }
    })

    it('Can use custom abort controller', async ({ endpoint }) => {
      const controller = new AbortController()
      const request = zlFetch(`${endpoint}/stream-sse`, { controller })
      controller.abort()
      await request.catch(err => expect(err.name).toBe('AbortError'))
    })
  })

  // ========================
  // Receiving Responses
  // ========================
  describe(`Receiving Responses (from ${environment})`, context => {
    it('Handles JSON response', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/json`)
      expect(response.body.key).toBe('value')
    })

    it('Handles Text response', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/text`)
      expect(response.body).toBe('A paragraph of text')
    })
    it('Handles x-www-urlencoded', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/x-www-form-urlencoded`)
      expect(response.body.message).toBe('Error message')
    })
  })

  // ========================
  // Basic Error Handling
  // ========================
  describe(`Handling Errors (from ${environment})`, context => {
    it('Throws Error', async ({ endpoint }) => {
      const error = await zlFetch(`${endpoint}/json-error`).catch(err => err)
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body.message).toBe('An error message')
    })

    it('Returns Error', async ({ endpoint }) => {
      const { response, error } = await zlFetch(`${endpoint}/json-error`, {
        returnError: true,
      })
      expect(response).toBeNull()
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body.message).toBe('An error message')
    })
  })

  // ========================
  // Basic shorthand requests
  // ========================
  describe(`Shorthand requests (from ${environment})`, context => {
    it('Shorthand GET request', async ({ endpoint }) => {
      const response = await zlFetch.get(`${endpoint}`)
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Shorthand POST request', async ({ endpoint }) => {
      const response = await zlFetch.post(`${endpoint}/body`, {
        body: { message: 'good game' },
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('Shorthand PUT request', async ({ endpoint }) => {
      const { response } = await zlFetch.put(`${endpoint}/body`, {
        body: { message: 'good game' },
        returnError: true,
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })
  })

  // ========================
  // Debug Queries
  // ========================
  describe(`Debug (from ${environment})`, context => {
    it('GET Request that contain queries', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}/queries`, {
        debug: true,
        queries: {
          normal: 'normal',
          toEncode: 'http://google.com',
        },
      })

      const url = debug.url
      expect(url).toMatch(/\?/)

      const queries = url.split('?')[1].split('&')
      expect(queries[0]).toBe('normal=normal')
      expect(queries[1]).toBe('toEncode=http%3A%2F%2Fgoogle.com')
    })

    it('GET Request that contain query', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}/queries`, {
        debug: true,
        query: {
          normal: 'normal',
          toEncode: 'http://google.com',
        },
      })

      const url = debug.url
      expect(url).toMatch(/\?/)

      const queries = url.split('?')[1].split('&')
      expect(queries[0]).toBe('normal=normal')
      expect(queries[1]).toBe('toEncode=http%3A%2F%2Fgoogle.com')
    })

    it('Simple GET skips preflight', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}/`, {
        debug: true,
      })
      expect(debug.method).toBe('GET')
      expect(debug.headers).toEqual({})
      expect(debug.body).toBeUndefined()
    })

    it('Preflight', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}/`, {
        method: 'options',
        debug: true,
      })
      expect(debug.method).toBe('OPTIONS')
      expect(debug.headers).toEqual({})
      expect(debug.body).toBeUndefined()
    })
  })

  // ========================
  // Authentication
  // ========================
  describe(`Authentication (from ${environment})`, context => {
    it('Ensures Btoa function works', async => {
      // Test btoa function to ensure there's no error.
      // Using a expect(1).toBe(1) to ensure this test passes...
      const btoa = getBtoa()
      expect(1).toBe(1)
    })

    it('Implicit Grant', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}`, {
        debug: true,
        auth: {
          username: 12345,
        },
      })
      const encoded = 'MTIzNDU6'
      const authHeader = debug.headers.authorization
      expect(authHeader).toBe(`Basic ${encoded}`)
    })

    it('Basic Auth', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}`, {
        debug: true,
        auth: {
          username: 12345,
          password: 678910,
        },
      })
      const encoded = 'MTIzNDU6Njc4OTEw'
      const authHeader = debug.headers.authorization
      expect(authHeader).toBe(`Basic ${encoded}`)
    })

    it('Bearer Auth', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}`, {
        debug: true,
        auth: '12345',
      })
      const authHeader = debug.headers.authorization
      expect(authHeader).toBe('Bearer 12345')
    })
  })

  // ========================
  // Create
  // ========================
  describe('Create zlFetch object', _ => {
    it('Simple GET', async ({ endpoint }) => {
      const created = createZlFetch(endpoint)
      const response = await created('createZlFetch')
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Normalizes baseURL and URL', async ({ endpoint }) => {
      // BaseURL does not have /
      const created = createZlFetch(endpoint)
      const [response1, response2] = await Promise.all([
        created('createZlFetch'),
        created('/createZlFetch'),
      ])

      expect(response1.body).toBe('Hello World')
      expect(response1.status).toBe(200)
      expect(response2.body).toBe('Hello World')
      expect(response2.status).toBe(200)

      // BaseURL have /
      const created2 = createZlFetch(endpoint + '/')
      const [response3, response4] = await Promise.all([
        created2('createZlFetch'),
        created2('/createZlFetch'),
      ])

      expect(response3.body).toBe('Hello World')
      expect(response3.status).toBe(200)
      expect(response4.body).toBe('Hello World')
      expect(response4.status).toBe(200)
    })

    // Shorthands
    // ========================
    it('Shorthand GET request', async ({ endpoint }) => {
      const created = createZlFetch(endpoint)
      const response = await created.get('createZlFetch')
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Shorthand POST request', async ({ endpoint }) => {
      const created = createZlFetch(endpoint)
      const response = await created.post('createZlFetch', {
        body: { message: 'good game' },
      })

      expect(response.body.message).toBe('good game')
      expect(response.status).toBe(200)
    })

    it('Shorthand PUT request', async ({ endpoint }) => {
      const created = createZlFetch(endpoint)
      const response = await created.put('createZlFetch', {
        body: { message: 'good game' },
      })

      expect(response.body.message).toBe('good game')
      expect(response.status).toBe(200)
    })

    it('Shorthand DELETE request', async ({ endpoint }) => {
      const created = createZlFetch(endpoint)
      const response = await created.delete('createZlFetch')
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Transfers Options accurately', async ({ endpoint }) => {
      const created = createZlFetch(endpoint, {
        auth: '12345',
      })

      const { response, debug } = await created.post('createZlFetch', {
        debug: true,
        body: {
          message: 'Hello World',
        },
      })

      let { headers, body } = debug
      body = JSON.parse(body)

      expect(debug.url).toBe(`${endpoint}/createZlFetch`)
      expect(headers.authorization).toBe('Bearer 12345')
      expect(headers['content-type']).toBe('application/json')
      expect(body.message).toBe('Hello World')
    })
  })

  describe('Created zlFetch Object', _ => {
    it('Should not require a URL', async ({ endpoint }) => {
      // Because the URL can already be set in createZlFetch itself
      const created = createZlFetch(`${endpoint}/createZlFetch/`)
      const response = await created()
      // const response2 = await created('something')
      // const response3 = await created('something', { body: 'haha' })
      // const response4 = await created({ body: 'haha' })
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Can have options without URL', async ({ endpoint }) => {
      // Because the URL can already be set in createZlFetch itself
      const created = createZlFetch(`${endpoint}/createZlFetch/`)
      const response = await created.post({ body: { message: 'haha' } })

      expect(response.body.message).toBe('haha')
      expect(response.status).toBe(200)
    })
  })

  // ========================
  // Streaming Responses
  // ========================
  describe(`Streaming Responses (from ${environment})`, context => {
    it('Handles Server-Sent Events (SSE) via promises', ({ endpoint }) => {
      return zlFetch(`${endpoint}/stream-sse`).then(async response => {
        const chunks = []
        for await (const chunk of response.body) {
          expect(chunk).toHaveProperty('data')
          expect(chunk).toHaveProperty('event')
          chunks.push(chunk)
        }
        expect(chunks.length).toBe(14)
        expect(typeof chunks[0].data).toBe('object')

        // Every third chunk should be a status event
        const statusEvents = chunks.filter(chunk => chunk.event === 'status')
        expect(statusEvents.length).toBeGreaterThan(0)
        expect(typeof statusEvents[0].data).toBe('string')

        // Last chunk should be a close event
        const lastChunk = chunks[chunks.length - 1]
        expect(lastChunk.event).toBe('close')
      })
    })

    it('Handles Server-Sent Events (SSE)', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/stream-sse`)
      const chunks = []

      for await (const chunk of response.body) {
        expect(chunk).toHaveProperty('data')
        expect(chunk).toHaveProperty('event')
        chunks.push(chunk)
      }

      expect(chunks.length).toBe(14)

      // Expect data to be parsed from string to object
      expect(typeof chunks[0].data).toBe('object')

      // Every third chunk should be a status event
      const statusEvents = chunks.filter(chunk => chunk.event === 'status')
      expect(statusEvents.length).toBeGreaterThan(0)
      expect(typeof statusEvents[0].data).toBe('string')

      // Last chunk should be a close event
      const lastChunk = chunks[chunks.length - 1]
      expect(lastChunk.event).toBe('close')
    })

    it('Handles chunked transfer encoding', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/stream-chunked`)
      const chunks = []

      for await (const chunk of response.body) {
        expect(chunk).toMatch(/Chunk/)
        chunks.push(chunk)
      }

      // Should receive 10 chunks
      expect(chunks.length).toBe(10)

      // Each chunk should be a string with the expected format
      chunks.forEach((chunk, index) => {
        expect(typeof chunk).toBe('string')
        expect(chunk).toMatch(new RegExp(`Chunk ${index + 1}:`))
      })
    })

    // Can't test this on node environemnts — even if mimic browser, because node environments will handle chunking. While browser environments will need readStream.
    // it.only('Handles regular streams', async ({ endpoint }) => {
    //   const response = await zlFetch(`${endpoint}/stream`)
    //   const stream = readStream(response.body)
    //   const chunks = []

    //   for await (const chunk of stream) {
    //     console.log(chunk);
    //     chunks.push(chunk)
    //   }

    //   // Should receive 10 chunks
    //   expect(chunks.length).toBe(10)

    //   // Each chunk should be a string with the expected format
    //   chunks.forEach((chunk, index) => {
    //     expect(typeof chunk).toBe('string')
    //     expect(chunk).toMatch(new RegExp(`Chunk ${index + 1}:`))
    //   })
    // })
  })

  // ========================
  // EventSource Tests
  // ========================
  // Tests don't test with the browser environment, unfortunately.
  describe(`EventSource (from ${environment})`, context => {
    it('Receives standard and custom events', async ({ endpoint }) => {
      const source = zlEventSource(`${endpoint}/stream-sse`, {
        message(data) {
          expect(data).toHaveProperty('chunk')
          expect(data).toHaveProperty('message')
          expect(typeof data.message).toBe('string')
        },
        status(data) {
          expect(typeof data).toBe('string')
        },
      })
      setTimeout(() => {
        source.close()
      }, 200)
      return source
    })

    it('Is closable', async ({ endpoint }) => {
      const chunks = []
      const source = zlEventSource(`${endpoint}/stream-sse`, {
        message(data) {
          chunks.push(data)
          expect(chunks.length).toBeLessThan(10)
        },
        error(error) {
          expect(error.name).toBe('AbortError')
        },
        close(msg) {},
      })
      setTimeout(() => {
        source.close()
      }, 500)
      return source
    })

    // To test retries in the future and see if it works
    // Not sure if we really really really need a node event stream yet, cos they usually seem to be handled with SDKs already?
    // it('Node Only: Respects custom retry interval', async ({ endpoint }) => {
    //   const retryInterval = 1000
    //   const errors = []
    //   const startTime = Date.now()
    //   let reconnectTime

    //   await zlEventSource(`${endpoint}/stream-sse`, {
    //     retry: retryInterval,
    //     error: err => {
    //       errors.push(err)
    //       reconnectTime = Date.now()
    //     },
    //   })

    //   // Simulate an error by closing the server
    //   await teardown()

    //   // Wait for error and reconnection attempt
    //   await new Promise(resolve => setTimeout(resolve, retryInterval + 100))

    //   expect(errors.length).toBeGreaterThan(0)
    //   expect(reconnectTime - startTime).toBeGreaterThanOrEqual(retryInterval)
    // })

    // it('Handles server-sent retry interval', async ({ endpoint }) => {
    //   const errors = []
    //   const startTime = Date.now()
    //   let reconnectTime

    //   await zlEventSource(`${endpoint}/stream-sse`, {
    //     error: err => {
    //       errors.push(err)
    //       reconnectTime = Date.now()
    //     },
    //   })

    //   // Modify server to send retry interval
    //   server.on('request', (req, res) => {
    //     if (req.url === '/stream-sse') {
    //       res.writeHead(200, {
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache',
    //         Connection: 'keep-alive',
    //       })
    //       res.write('retry: 2000\n\n')
    //       res.write('data: {"error":"connection lost"}\n\n')
    //       res.end()
    //     }
    //   })

    //   // Wait for error and reconnection attempt
    //   await new Promise(resolve => setTimeout(resolve, 2100))

    //   expect(errors.length).toBeGreaterThan(0)
    //   expect(reconnectTime - startTime).toBeGreaterThanOrEqual(2000)
    // })
  })
}
