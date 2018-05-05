import 'isomorphic-fetch'
import test from 'ava'
import createRequestOptions from '../src/createRequestOptions'
import btoa from 'btoa'

test('Defaults to get method', t => {
  const test = createRequestOptions({})
  t.is(test.method, 'get')
})

test('Defaults to application/json', t => {
  const test = createRequestOptions({})
  t.is(test.headers.get('content-type'), 'application/json')
})

test('Defaults to undefined body', t => {
  const test = createRequestOptions({})
  t.is(test.body, undefined)
})

test('Respect user-created headers', t => {
  const body = 'param1=value1'
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

test('Respects user-created method', t => {
  const body = { key: 'value' }
  const test = createRequestOptions({ method: 'post', body })
  t.is(test.method, 'post')
})

test('Converts body to JSON if content type not specified', t => {
  const body = { key: 'value' }
  const test = createRequestOptions({ body })
  t.deepEqual(test.body, JSON.stringify(body))
})

test('Creates auth header for basic auth', t => {
  const error = t.throws(() => createRequestOptions({ username: 'aoeu' }))
  t.is(error.message, 'password required for basic authentication')

  const error2 = t.throws(() => createRequestOptions({ password: 'aoeu' }))
  t.is(error2.message, 'username required for basic authentication')

  const test = createRequestOptions({ username: 123, password: 123 })
  t.is(test.headers.get('authorization'), `Basic ${btoa('123:123')}`)
})

test('Creates auth header for token auth', t => {
  const test = createRequestOptions({ token: 'mytoken' })
  t.is(test.headers.get('authorization'), 'Bearer mytoken')
})

test('Creates params', t => {
  const test = createRequestOptions({
    url: 'link',
    params: {
      key1: 'value1',
      website: 'https://test.com'
    }
  })

  const urlString = `link?key1=value1&website=https%3A%2F%2Ftest.com`
  t.is(test.url, urlString)
})
