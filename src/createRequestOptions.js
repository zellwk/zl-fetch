/* global Headers btoa */
const setHeaders = ({ headers = {}, body, method = 'get', auth } = {}) => {
  if (typeof Headers === 'undefined') {
    require('cross-fetch/polyfill')
  }

  const h = new Headers(headers)

  // Don't set any headers for preflight requests
  if (method === 'options') return h

  // Default content type to 'application/json' for POST, PUT, PATCH, DELETE
  if (!h.get('content-type') && method !== 'get') {
    h.set('content-type', 'application/json')
  }

  if (auth) {
    // Basic Auth
    if (typeof auth === 'object') {
      const { username, password } = auth
      if (!username) {
        throw new Error('Username required for basic authentication')
      }
      if (!password) {
        throw new Error('Password required for basic authentication')
      }

      let encode
      if ('btoa' in window) {
        encode = btoa
      } else {
        encode = require('btoa')
      }

      h.set('Authorization', 'Basic ' + encode(`${username}:${password}`))
    } else {
      // Bearer Auth
      h.set('Authorization', `Bearer ${auth}`)
    }
  }

  return h
}

const queryStringify = params => {
  if (!params) return
  return Object.entries(params).reduce((acc, entry, index) => {
    const [param, value] = entry
    const encoded =
      index === 0
        ? `${param}=${encodeURIComponent(value)}`
        : `&${param}=${encodeURIComponent(value)}`
    return `${acc}${encoded}`
  }, '')
}

/**
 * Appends queries to URL
 * @param {Object} opts
 */
const createURL = opts => {
  const { url, queries } = opts
  if (!queries) return url
  return `${url}?${queryStringify(queries)}`
}

const formatBody = opts => {
  const method = opts.method
  if (method === 'get') return

  const contentType = opts.headers.get('content-type')
  if (!contentType) return

  if (contentType.includes('x-www-form-urlencoded'))
    return queryStringify(opts.body)
  if (contentType.includes('json')) return JSON.stringify(opts.body)

  return opts.body
}

// Defaults to GET method
// Defaults content type to application/json
// Creates authorization headers automatically
export default (options = {}) => {
  const opts = Object.assign({}, options)

  opts.url = createURL(opts)
  opts.method = opts.method || 'get'
  opts.headers = setHeaders(opts)
  opts.body = formatBody(opts)

  // Removes options that are not native to Fetch
  delete opts.auth

  return opts
}
