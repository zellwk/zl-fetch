// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { setup, teardown } from './helpers/setup.js'
import integrationTests from './helpers/integration-tests.js'

beforeEach(setup)
afterEach(teardown)

integrationTests('Browser')
