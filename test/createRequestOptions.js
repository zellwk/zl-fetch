import 'isomorphic-fetch'
import test from 'ava'
import createRequestOptions from '../../src/createRequestOptions'
import btoa from 'btoa'

test('createRequestOptions (default settings)', t => {
  const test = createRequestOptions({})
  t.is(test.method, 'get')
  t.is(test.headers.get('content-type'), 'application/json')
  t.is(test.body, undefined)
})

test('createRequestOptions (respect user headers)', t => {
  const body = { key: 'value' }
  const test = createRequestOptions({
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

test('createRequestOptions (respect user method)', t => {
  const body = { key: 'value' }
  const test = createRequestOptions({
    method: 'post',
    body
  })

  t.is(test.method, 'post')
  t.deepEqual(test.body, JSON.stringify(body))
})

test('createRequestOptions (basic auth)', t => {
  const error = t.throws(() => createRequestOptions({ username: 'aoeu' }))
  t.is(error.message, 'password required for basic authentication')

  const error2 = t.throws(() => createRequestOptions({ password: 'aoeu' }))
  t.is(error2.message, 'username required for basic authentication')

  const test = createRequestOptions({ username: 123, password: 123 })
  t.is(test.headers.get('authorization'), `Basic ${btoa('123:123')}`)
})

test('createRequestOptions (token auth)', t => {
  const test = createRequestOptions({ token: 'mytoken' })
  t.is(test.headers.get('authorization'), 'Bearer mytoken')
})
