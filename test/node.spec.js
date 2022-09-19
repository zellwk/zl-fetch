import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { setup, teardown } from './helpers/setup.js'
import zlFetch from '../src/index.js'

beforeEach(setup)
afterEach(teardown)

describe('Sending Requests (from Browser)', context => {
  it('Simple GET request', async ({ endpoint }) => {
    const response = await zlFetch(`${endpoint}`)
    expect(response.body).toBe('Hello World')
    expect(response.status).toBe(200)
  })
})
