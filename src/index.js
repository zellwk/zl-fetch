/* globals fetch */
const createRequestOptions = require('./createRequestOptions')
const handleResponse = require('./handleResponse')

const zlFetch = (url, options) => {
  const opts = createRequestOptions(Object.assign({ url }, options))
  return fetch(opts.url, opts)
    .then(handleResponse)
}

// ========================
// Shorthands
// ========================
const methods = ['get', 'post', 'put', 'patch', 'delete']

for (const method of methods) {
  zlFetch[method] = function (url, options) {
    options = Object.assign({ method }, options)
    return zlFetch(url, options)
  }
}

module.exports = zlFetch
module.exports.default = zlFetch
