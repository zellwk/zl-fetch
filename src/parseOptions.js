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

    const base = encode(`${username}:${password}`)
    h.set('Authorization', `Basic ${base}`)
  }

  if (token) {
    h.set('Authorization', `Bearer ${token}`)
  }
  h.get('content-type')
    ? undefined
    : h.set('content-type', 'application/json')

  return h
}

// Defaults to GET method
// Defaults content type to application/json
// Creates authorization headers automatically
module.exports = (options = {}) => {
  const opts = Object.assign({}, options)
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
