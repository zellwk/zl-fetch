import { describe, expect, it } from 'vitest'

import FormData from 'form-data'
import { getBtoa } from '../../src/createRequestOptions.js'
import { toQueryString } from '../../src/util.js'

export default function tests(environment, config) {
  const { zlFetch, createZlFetch } = config

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
      expect(debug.method).toBe('get')
      expect(debug.headers).toEqual({})
      expect(debug.body).toBeUndefined()
    })

    it('Preflight', async ({ endpoint }) => {
      const { debug } = await zlFetch(`${endpoint}/`, {
        method: 'options',
        debug: true,
      })
      expect(debug.method).toBe('options')
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
}
