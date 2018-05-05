const createRequestOptions = require('./createRequestOptions')
const handleResponse = require('./handleResponse')

module.exports = (url, options = undefined) => {
  return fetch(url, createRequestOptions(options))
    .then(handleResponse)
}
