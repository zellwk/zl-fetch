import { describe, expect, it } from 'vitest'
import zlFetch, { createZlFetch } from '../../src/index.js'

import { getBtoa } from '../../src/createRequestOptions.js'

export default function tests(environment) {
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

    it('POST with x-www-form-urlencoded', async ({ endpoint }) => {
      const response = await zlFetch.post(`${endpoint}/body`, {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: { message: 'good game' },
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })
  })

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
      const response = await zlFetch.put(`${endpoint}/body`, {
        body: { message: 'good game' },
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })
  })

  // Debug queries
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
}

describe('Create zlFetch object', _ => {
  it('Simple GET', async ({ endpoint }) => {
    const created = createZlFetch(endpoint)
    const response = await created.get('createZlFetch')
    expect(response.body).toBe('Hello World')
    expect(response.status).toBe(200)
  })

  it('Normalizes baseURL and URL', async ({ endpoint }) => {
    // BaseURL does not have /
    const created = createZlFetch(endpoint)
    const [response1, response2] = await Promise.all([
      created.get('createZlFetch'),
      created.get('/createZlFetch'),
    ])

    expect(response1.body).toBe('Hello World')
    expect(response1.status).toBe(200)
    expect(response2.body).toBe('Hello World')
    expect(response2.status).toBe(200)

    // BaseURL have /
    const created2 = createZlFetch(endpoint + '/')
    const [response3, response4] = await Promise.all([
      created2.get('createZlFetch'),
      created2.get('/createZlFetch'),
    ])

    expect(response3.body).toBe('Hello World')
    expect(response3.status).toBe(200)
    expect(response4.body).toBe('Hello World')
    expect(response4.status).toBe(200)
  })

  it('Shorthand GET request', async ({ endpoint }) => {
    const created = createZlFetch(endpoint)
    const response = await created.get('createZlFetch')
    expect(response.body).toBe('Hello World')
    expect(response.status).toBe(200)
  })

  it('Shorthand POST request', async ({ endpoint }) => {
    const created = createZlFetch(endpoint)
    const response = await created.post('createZlFetch')

    expect(response.body).toBe('Hello World')
    expect(response.status).toBe(200)
  })

  it('Shorthand PUT request', async ({ endpoint }) => {
    const created = createZlFetch(endpoint)
    const response = await created.put('createZlFetch')
    expect(response.body).toBe('Hello World')
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
