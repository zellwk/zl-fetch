import test from 'ava'
import zlfES6Import from '../src/index.js'
const zlFetch = require('../src/index')

test('Works with ES6 imports and CommonJS require', t => {
  t.deepEqual(zlFetch, zlfES6Import)
})
