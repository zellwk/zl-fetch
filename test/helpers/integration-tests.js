import { describe, expect, it } from 'vitest'
import zlFetch from '../../src/index.js'

export default function tests (environment) {
  describe.concurrent(`Sending Requests (from ${environment})`, context => {
    it('Simple GET request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}`)
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Simple POST request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/body`, {
        method: 'post',
        body: { message: 'good game' }
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('Simple PUT request', async ({ endpoint }) => {
      const response = await zlFetch(`${endpoint}/body`, {
        method: 'put',
        body: { message: 'good game' }
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('GET requests with queries', async ({ endpoint }) => {
      const { response } = await zlFetch(`${endpoint}/queries`, {
        queries: {
          normal: 'normal',
          toEncode: 'http://google.com'
        }
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
        body: { message: 'good game' }
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })
  })

  describe.concurrent(`Receiving Responses (from ${environment})`, context => {
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

  describe.concurrent(`Handling Errors (from ${environment})`, context => {
    it('Throws Error', async ({ endpoint }) => {
      const error = await zlFetch(`${endpoint}/json-error`).catch(err => err)
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body.message).toBe('An error message')
    })

    it(`Returns Error`, async ({ endpoint }) => {
      const { response, error } = await zlFetch(`${endpoint}/json-error`, {
        returnError: true
      })
      expect(response).toBeNull()
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body.message).toBe('An error message')
    })
  })

  describe.concurrent(`Shorthand requests (from ${environment})`, context => {
    it('Shorthand GET request', async ({ endpoint }) => {
      const response = await zlFetch.get(`${endpoint}`)
      expect(response.body).toBe('Hello World')
      expect(response.status).toBe(200)
    })

    it('Shorthand POST request', async ({ endpoint }) => {
      const response = await zlFetch.post(`${endpoint}/body`, {
        body: { message: 'good game' }
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })

    it('Shorthand PUT request', async ({ endpoint }) => {
      const response = await zlFetch.put(`${endpoint}/body`, {
        body: { message: 'good game' }
      })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('good game')
    })
  })
}
