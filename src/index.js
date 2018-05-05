/* globals fetch */
const createRequestOptions = require('./createRequestOptions')
const handleResponse = require('./handleResponse')

module.exports = (url = undefined, options = undefined) => {
  const opts = createRequestOptions({ url, options })

  return fetch(opts.url, opts)
    .then(handleResponse)
}
