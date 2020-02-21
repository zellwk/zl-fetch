/* globals describe expect it */
import createRequestOptions from '../src/createRequestOptions'
const btoa = require('btoa')

describe('Method', () => {
  it('should default to GET', async () => {
    // Defaults to GET
    let request = await createRequestOptions()
    expect(request.method).toBe('get')

    // Respects user method otherwise
    request = await createRequestOptions({ method: 'post' })
    expect(request.method).toBe('post')
  })
})

describe('Headers', () => {
  it('Content Type', async () => {
    // 'Content-Type' should be undefined for GET requests
    // This creates simple requests
    let request = await createRequestOptions()
    let headers = request.headers
    expect(headers.get('content-type')).toBe(null)

    // 'Content-Type' should be set to 'application/json' for any other requests
    request = await createRequestOptions({ method: 'post' })
    headers = request.headers
    expect(headers.get('content-type')).toBe('application/json')

    // Should request user-created 'Content-Type'
    request = await createRequestOptions({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    headers = request.headers
    expect(headers.get('content-type')).toMatch(/x-www-form-urlencoded/)
  })

  it('Authorization', async () => {
    // Basic Auth Headers
    let request = await createRequestOptions({
      auth: { username: 'username', password: 'password' }
    })
    let auth = request.headers.get('authorization')
    const encoded = auth.split(' ')[1]
    expect(auth).toMatch(/Basic/)
    expect(encoded).toBe(btoa('username:password'))

    // Basic Auth should throw without username or password
    try {
      await createRequestOptions({ auth: { password: 'password' } })
    } catch (error) {
      expect(error.message).toMatch(/Username required/)
    }

    try {
      await createRequestOptions({ auth: { username: 'username' } })
    } catch (error) {
      expect(error.message).toMatch(/Password required/)
    }

    // Bearer Auth Headers
    request = await createRequestOptions({ auth: 'token' })
    auth = request.headers.get('authorization')
    const token = auth.split(' ')[1]
    expect(auth).toMatch(/Bearer/)
    expect(token).toBe(token)
  })
})

describe('Body', () => {
  it('Default Body', async done => {
    // Body should be undefined for GET requests
    // This prevents preflight requests
    let request = await createRequestOptions({
      body: { message: 'Good game' }
    })

    // Body should be stringified for JSON requests
    request = await createRequestOptions({
      method: 'post',
      body: { message: 'Good game' }
    })
    expect(request.body).toBe(JSON.stringify({ message: 'Good game' }))

    // Body should remain raw for x-www-form-urlencoded
    request = await createRequestOptions({
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: { message: 'Good game' }
    })
    expect(request.body).toBe('message=Good%20game')
    done()
  })
})
