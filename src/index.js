/* globals fetch */
const createRequestOptions = require('./createRequestOptions')
const handleResponse = require('./handleResponse')

const zlFetch = (url, options) => {
  const opts = createRequestOptions({ url, options })
  return fetch(opts.url, opts)
    .then(handleResponse)
}

module.exports = zlFetch
module.exports.default = zlFetch
