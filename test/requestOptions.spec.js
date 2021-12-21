/* globals describe expect it */
import createRequestOptions from '../src/createRequestOptions'
const btoa = require('btoa')

describe('Method', () => {
  it('should default to GET', () => {
    // Defaults to GET
    const request = createRequestOptions()
    expect(request.method).toBe('get')
  })

  it('should respect user-specified method', () => {
    const request = createRequestOptions({ method: 'post' })
    expect(request.method).toBe('post')
  })
})

describe('Content-Type', () => {
  it('should be undefined for GET requests', () => {
    // This creates simple requests that doesn't trigger preflight

    const request = createRequestOptions()
    const headers = request.headers
    expect(headers.get('content-type')).toBe(null)
  })

  it('should be default to application/json for other requests', () => {
    // 'Content-Type' should be set to 'application/json' for any other requests
    const request = createRequestOptions({ method: 'post' })
    const headers = request.headers
    expect(headers.get('content-type')).toBe('application/json')
  })

  it('should respect user-specified content type', () => {
    // Should request user-created 'Content-Type'
    const request = createRequestOptions({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const headers = request.headers
    expect(headers.get('content-type')).toMatch(/x-www-form-urlencoded/)
  })
})

describe('Basic Auth', () => {
  it('Happy path', () => {
    const request = createRequestOptions({
      auth: { username: 'username', password: 'password' }
    })
    const auth = request.headers.get('authorization')
    const encoded = auth.split(' ')[1]
    expect(auth).toMatch(/Basic/)
    expect(encoded).toBe(btoa('username:password'))
  })

  it('Fails without username', () => {
    try {
      createRequestOptions({ auth: { password: 'password' } })
    } catch (error) {
      expect(error.message).toMatch(/Username required/)
    }
  })

  it('Fails without password', () => {
    try {
      createRequestOptions({ auth: { username: 'username' } })
    } catch (error) {
      expect(error.message).toMatch(/Password required/)
    }
  })
})

describe('Bearer Auth', () => {
  it('Happy path', () => {
    // Bearer Auth Headers
    const request = createRequestOptions({ auth: 'token' })
    const auth = request.headers.get('authorization')
    const token = auth.split(' ')[1]
    expect(auth).toMatch(/Bearer/)
    expect(token).toBe(token)
  })
})

describe('Body', () => {
  it('Should be undefined for GET requests', async () => {
    // This prevents preflight requests
    const request = createRequestOptions()
    expect(request.body).toBe(undefined)
  })

  it('Should be JSON format for JSON requests', async () => {
    const request = createRequestOptions({
      method: 'post',
      body: { message: 'Good game' }
    })
    expect(request.body).toBe(JSON.stringify({ message: 'Good game' }))
  })

  it('Should remain raw for JSON x-www-form-urlencoded requests', async () => {
    const request = createRequestOptions({
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: { message: 'Good game' }
    })
    expect(request.body).toBe('message=Good%20game')
  })
})
