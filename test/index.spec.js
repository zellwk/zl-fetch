import 'isomorphic-fetch'
import test from 'ava'
import zlFetch from '../src/index.js'
import { before, after } from './helpers/createServer'

test.before(before)

test('handles json', async t => {
  const res = await zlFetch('http://localhost:3000/json')

  t.is(res.status, 200)
  t.is(res.statusText, 'OK')
  t.is(typeof res.headers, 'object')
  t.deepEqual(res.body, { key: 'value' })
})

test('handles json error', async t => {
  try {
    await zlFetch('http://localhost:3000/json-error')
  } catch (e) {
    t.is(e.status, 400)
    t.is(e.statusText, 'Bad Request')
    t.is(typeof e.headers, 'object')
    t.deepEqual(e.body, { err: 'some message' })
  }
})

test('handles text', async t => {
  const res = await zlFetch('http://localhost:3000/text')

  t.is(res.status, 200)
  t.is(res.statusText, 'OK')
  t.is(typeof res.headers, 'object')
  t.deepEqual(res.body, 'booyah!')
})

test('handles text error', async t => {
  try {
    await zlFetch('http://localhost:3000/text-error')
  } catch (e) {
    t.is(e.status, 400)
    t.is(e.statusText, 'Bad Request')
    t.is(typeof e.headers, 'object')
    t.deepEqual(e.body, 'username required')
  }
})

test('passes params', async t => {
  const res = await zlFetch('http://localhost:3000/params', {
    params: {
      one: 'two',
      web: 'http://google.com'
    }
  })

  t.deepEqual(res.body, { one: 'two', web: 'http://google.com' })
})

// Note to self: Create a test for cloned response.
// Requires Isomorphic-fetch to upgrade to node-fetch v1.4.0 to test on node
// test('Sends a cloned response (whenever possible)', async t => {
//   const res = await zlFetch('http://localhost:3000/params')
//   const clone = res.response.clone()
//   // console.log('testing')
//   console.log()

//   t.is(clone, 'function')
// })

test.after.always(after)
