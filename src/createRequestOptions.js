/* globals Headers btoa */
const setHeaders = ({
  headers = {},
  body,
  method,
  username,
  password,
  token
} = {}) => {
  const h = new Headers(headers)

  if (username || password) {
    if (!username) throw new TypeError('username required for basic authentication')
    if (!password) throw new TypeError('password required for basic authentication')
    const encode = typeof btoa === 'function'
      ? btoa
      : require('btoa')
    h.set('Authorization', `Basic ${encode(`${username}:${password}`)}`)
  }
  if (token) h.set('Authorization', `Bearer ${token}`)
  if (!h.get('content-type')) h.set('content-type', 'application/json')

  return h
}

const createURL = opts => {
  const { url, params } = opts
  if (!params) return url

  return Object.entries(params)
    .reduce((acc, entry, index) => {
      const [param, value] = entry
      const encoded = index === 0
        ? `?${param}=${encodeURIComponent(value)}`
        : `&${param}=${encodeURIComponent(value)}`

      return `${acc}${encoded}`
    }, `${url}`)
}

// Defaults to GET method
// Defaults content type to application/json
// Creates authorization headers automatically
module.exports = (options = {}) => {
  const opts = Object.assign({}, options)

  opts.url = createURL(opts)
  opts.method = opts.method || 'get'
  opts.headers = setHeaders(opts)
  opts.body = opts.headers.get('content-type') === 'application/json'
    ? JSON.stringify(opts.body)
    : opts.body

  delete opts.username
  delete opts.password
  delete opts.token

  return opts
}
