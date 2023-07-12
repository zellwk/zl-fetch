// @vitest-environment jsdom
import { afterEach, beforeEach } from 'vitest'
import { setup, teardown } from './helpers/setup.js'
import zlFetch, { createZlFetch } from '../src/index.js'

import integrationTests from './helpers/integration-tests.js'

beforeEach(setup)
afterEach(teardown)

integrationTests('Browser', { zlFetch, createZlFetch })
