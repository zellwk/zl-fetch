import { expect, it } from 'vitest'
import zlFetch from '../src/index.js'

// Sending an actual test to Github to ensure zlFetch works
it('Test sending to Github', async () => {
  const response = await zlFetch('https://api.github.com/users/zellwk/repos')
  expect(response.body.length === 30)
})
