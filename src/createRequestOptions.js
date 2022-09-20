/* global Headers btoa */

export default function createRequestOptions (options = {}) {
  let opts = Object.assign({}, options)

  opts.url = setUrl(opts)
  opts.method = setMethod(opts)
  opts.headers = setHeaders(opts)
  opts.body = setBody(opts)

  return opts
}

/**
 * Appends queries to URL
 * @param {Object} opts
 */
function setUrl (options) {
  const { url, queries, query } = options

  // Merge queries and query for easier use
  // So users don't have to remember singluar or plural forms
  const q = Object.assign({}, queries, query)

  if (isEmptyObject(q)) return options.url

  const searchParams = new URLSearchParams(q)
  return `${url}?${searchParams.toString()}`
}

function isEmptyObject (obj) {
  return (
    obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}

function setMethod (options) {
  // Method set to GET by default unless otherwise specified
  const method = options.method || 'get'
  return method
}

function setHeaders (options) {
  const fetchHeaders = options.fetch.Headers
  const headers = new fetchHeaders(options.headers)

  // For preflight requests, we don't want to set headers.
  // This allows requests to remain simple.
  if (options.method === 'options') return headers

  // Set headers to Content-Type: application/json by default
  // We set this only for POST, PUT, PATCH, DELETE so GET requests can remain simple.
  if (!headers.get('content-type') && options.method !== 'get') {
    headers.set('content-type', 'application/json')
  }

  // Create Authorization Headers if the auth option is present
  if (!options.auth) return headers

  const { auth } = options.auth
  const btoa = getBtoa()

  // We help to create Basic Authentication when users pass in username and password fields. Note that Password field is optional for implicit grant.
  if (typeof auth === 'object') {
    const { username, password } = auth
    if (!username) {
      throw new Error(
        'Please fill in your username to create an Authorization Header for Basic Authenication'
      )
    }
    const encodedValue = btoa(`${username}:${password}`)
    headers.set('Authorization', `Basic ${encodedValue}`)
  }

  // We help to create Bearer Authentication when the user passes in a token string to the `auth` option.
  if (typeof auth === 'string') {
    headers.set('Authorization', `Bearer ${auth}`)
  }

  return headers
}

function getBtoa () {
  if (window?.btoa) return window.btoa
  return function (string) {
    Buffer.from(string).toString('base64')
  }
}

function setBody (options) {
  // If it is a GET request, we return an empty value because GET requests don't use the body property.
  const method = options.method
  if (method === 'get') return

  // If the content type is not specified, we ignore the body field so we can return a simple request for preflight checks
  const contentType = options.headers.get('content-type')
  if (!contentType) return

  // If the content type is x-www-form-urlencoded, we format the body with a query string.
  if (contentType.includes('x-www-form-urlencoded')) {
    const searchParams = new URLSearchParams(options.body)
    return searchParams.toString()
  }

  // If the content type is JSON, we stringify the body.
  if (contentType.includes('json')) {
    return JSON.stringify(options.body)
  }

  // If the above conditions don't trigger, we return the body as is,  just in case.
  return options.body
}
