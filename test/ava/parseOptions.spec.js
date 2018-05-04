import 'isomorphic-fetch'
import test from 'ava'
import parseOptions from '../../src/parseOptions'
import btoa from 'btoa'

test('parseOptions (default settings)', t => {
  const test = parseOptions({})
  t.is(test.method, 'get')
  t.is(test.headers.get('content-type'), 'application/json')
  t.is(test.body, undefined)
})

test('parseOptions (respect user headers)', t => {
  const body = { key: 'value' }
  const test = parseOptions({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Custom-Header': 'something special'
    },
    body
  })

  t.is(test.headers.get('content-type'), 'application/x-www-form-urlencoded')
  t.is(test.headers.get('X-custom-header'), 'something special')
  t.deepEqual(test.body, body)
})

test('parseOptions (respect user method)', t => {
  const body = { key: 'value' }
  const test = parseOptions({
    method: 'post',
    body
  })

  t.is(test.method, 'post')
  t.deepEqual(test.body, JSON.stringify(body))
})

test('parseOptions (basic auth)', t => {
  const error = t.throws(() => parseOptions({ username: 'aoeu' }))
  t.is(error.message, 'password required for basic authentication')

  const error2 = t.throws(() => parseOptions({ password: 'aoeu' }))
  t.is(error2.message, 'username required for basic authentication')

  const test = parseOptions({ username: 123, password: 123 })
  t.is(test.headers.get('authorization'), `Basic ${btoa('123:123')}`)
})

test('parseOptions (token auth)', t => {
  const test = parseOptions({ token: 'mytoken' })
  t.is(test.headers.get('authorization'), 'Bearer mytoken')
})
