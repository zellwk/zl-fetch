// @vitest-environment ./test/env/jsdom-fetch.js
import { afterEach, beforeEach } from 'vitest'
import zlFetch, { createZlFetch, readStream } from '../src/index.js'
import { setup, teardown } from './helpers/setup.js'

import integrationTests from './helpers/integration-tests.js'

beforeEach(setup)
afterEach(teardown)

integrationTests('Browser', { zlFetch, createZlFetch, readStream })
