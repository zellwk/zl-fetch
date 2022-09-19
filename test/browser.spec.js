// @vitest-environment happy-dom
import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import zlFetch from '../src/index.js'
import app from './helpers/server.js'
import portastic from 'portastic'

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

describe('Sending Requests (from Browser)', context => {
  it('Simple GET request', async () => {
    const response = await zlFetch(`${rootendpoint}`)
    expect(response.body).toBe('Hello World')
    expect(response.status).toBe(200)
  })
})
