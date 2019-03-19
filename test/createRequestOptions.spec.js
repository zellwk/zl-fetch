import 'isomorphic-fetch'
import test from 'ava'
import createRequestOptions from '../src/createRequestOptions'
import btoa from 'btoa'

// Method
test('Defaults to get method', t => {
  const test = createRequestOptions({})
  t.is(test.method, 'get')
})

test('Respects user-created method', t => {
  const body = { key: 'value' }
  const test = createRequestOptions({ method: 'post', body })
  t.is(test.method, 'post')
})

// Headers
test(`Headers: Should be null for 'GET' requests`, t => {
  const test = createRequestOptions({})
  t.is(test.headers.get('content-type'), null)
})

test('Headers: Should be application/json for all other requests', t => {
  const test = createRequestOptions({ method: 'post' })
  t.is(test.headers.get('content-type'), 'application/json')
})

test('Headers: Should respect user-created headers', t => {
  const test = createRequestOptions({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Custom-Header': 'something special'
    }
  })

  t.is(test.headers.get('content-type'), 'application/x-www-form-urlencoded')
  t.is(test.headers.get('X-custom-header'), 'something special')
})

// Body
test('Body: should be undefined by default', t => {
  const test = createRequestOptions({})
  t.is(test.body, undefined)
})

test(`Body: should be undefined for 'get' requests`, t => {
  const body = { key: 'value' }
  const test = createRequestOptions({ body, method: 'get' })
  t.is(test.body, undefined)
})

test(`Body: should be a JSON string if content type is 'application/json`, t => {
  const body = { key: 'value' }
  const test = createRequestOptions({ body, method: 'post' })
  t.deepEqual(test.body, JSON.stringify(body))
})

test('QueryStringify body for x-www-form-urlencoded', t => {
  const test = createRequestOptions({
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: {
      key: 'value',
      web: 'https://stringify.com'
    }
  })
  t.deepEqual(test.body, 'key=value&web=https%3A%2F%2Fstringify.com')
})

// Auth headers
test('Basic auth', t => {
  const error = t.throws(() => createRequestOptions({ username: 'aoeu' }))
  t.is(error.message, 'password required for basic authentication')

  const error2 = t.throws(() => createRequestOptions({ password: 'aoeu' }))
  t.is(error2.message, 'username required for basic authentication')

  const test = createRequestOptions({ username: 123, password: 123 })
  t.is(test.headers.get('authorization'), `Basic ${btoa('123:123')}`)
})

test('Token auth', t => {
  const test = createRequestOptions({ token: 'mytoken' })
  t.is(test.headers.get('authorization'), 'Bearer mytoken')
})

// URL
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
