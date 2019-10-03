/* globals beforeEach afterEach describe expect it */
const portastic = require('portastic')
const zlFetch = require('../src/index')
const app = require('./helpers/createServer')

let port
let rootendpoint
let server

beforeEach(async () => {
  const ports = await portastic.find({ min: 8000, max: 8080 })
  port = ports[0]
  server = app.listen(port)
  rootendpoint = `http://localhost:${port}`
})

afterEach(async () => {
  server.close()
})

describe('Sending requests', () => {
  it('Queries in GET requests', async done => {
    // Sends GET requests with queries
    const response = await zlFetch(`${rootendpoint}/queries`, {
      queries: {
        normal: 'normal',
        toEncode: 'http://google.com'
      }
    })
    const url = response.response.url
    expect(url).toMatch(/\?/)

    const queries = url.split('?')[1].split('&')
    expect(queries[0]).toBe('normal=normal')
    expect(queries[1]).toBe('toEncode=http%3A%2F%2Fgoogle.com')

    done()
  })

  it('x-www-form-urlencoded', async done => {
    const response = await zlFetch(`${rootendpoint}/body`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: { message: 'good game' }
    })

    expect(response.body.message).toBe('good game')
    done()
  })

  it('JSON', async done => {
    const response = await zlFetch(`${rootendpoint}/body`, {
      method: 'post',
      body: { message: 'good game' }
    })

    expect(response.body.message).toBe('good game')
    done()
  })

  // TODO: Requires setting to multipart/form-data
  // Or possibly leave empty... and let fetch do its job...?
  it.todo('Sending FormData')
})

describe('Response Types', () => {
  it('should handle JSON response', async done => {
    // Should handle JSON
    const response = await zlFetch(`${rootendpoint}/json`)
    const body = response.body
    expect(body.key).toBe('value')

    // Should throw if JSON error
    try {
      await zlFetch(`${rootendpoint}/json-error`)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.status).toBe(400)
      expect(error.body.message).toBe('An error message')
    }
    done()
  })

  it('should handle text response', async done => {
    // Should handle Text
    const { body } = await zlFetch(`${rootendpoint}/text`)
    expect(body).toBe('A paragraph of text')

    // Should throw if JSON error
    try {
      await zlFetch(`${rootendpoint}/text-error`)
    } catch (error) {
      expect(error).toBeTruthy()
      expect(error.status).toBe(400)
      expect(error.body).toBe('An error message')
    }
    done()
  })
})

// ========================
// Method Shorthands
// ========================
