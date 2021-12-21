/* globals beforeEach afterEach describe expect it */
import zlFetch from '../src/index'
import app from './helpers/createServer'

const portastic = require('portastic')

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
  it('Queries in GET requests', async () => {
    // Sends GET requests with queries
    const { response } = await zlFetch(`${rootendpoint}/queries`, {
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

  it('x-www-form-urlencoded', async () => {
    const response = await zlFetch(`${rootendpoint}/body`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: { message: 'good game' }
    })

    expect(response.body.message).toBe('good game')
  })

  it('JSON', async () => {
    const response = await zlFetch(`${rootendpoint}/body`, {
      method: 'post',
      body: { message: 'good game' }
    })

    expect(response.body.message).toBe('good game')
  })

  // TODO: Requires setting to multipart/form-data
  // Or possibly leave empty... and let fetch do its job...?
  it.todo('Sending FormData')
})

describe('Response Types', () => {
  it('should handle JSON response', async () => {
    // Should handle JSON
    const response = await zlFetch(`${rootendpoint}/json`)
    expect(response.body.key).toBe('value')
  })

  it('should handle text response', async () => {
    const response = await zlFetch(`${rootendpoint}/text`)
    expect(response.body).toBe('A paragraph of text')
  })

  it('Should throw if JSON error', async () => {
    try {
      await zlFetch(`${rootendpoint}/text-error`)
    } catch (error) {
      expect(error.status).toBe(400)
      expect(error.statusText).toBe('Bad Request')
      expect(error.body).toBe('An error message')
    }
  })
})

it('Test sending to Github', async () => {
  const response = await zlFetch('https://api.github.com/users/zellwk/repos')
  expect(response.body.length === 30)
})

// ========================
// Method Shorthands
// ========================
