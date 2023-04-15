import { describe, expect, it } from 'vitest'

import zlFetch from '../src/index.js'

describe('Actual Tests', _ => {
  // Sending an actual test to Github to ensure zlFetch works
  it('Test sending to Github', async () => {
    const response = await zlFetch('https://api.github.com/users/zellwk/repos')
    expect(response.status).toBe(200)
    expect(response.body.length === 30)
  })

  it('Test with Open Dota API (preflight)', async () => {
    const response = await zlFetch('https://api.opendota.com/api/heroStats')
    expect(response.status).toBe(200)
  })

  it.todo(
    'Test with FormData — Find a way to test this because we need a browser environment.'
  )
})
