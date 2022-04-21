/* globals fetch */
import createRequestOptions from './createRequestOptions'
import { handleResponse, handleError } from './handleResponse'

if (typeof fetch === 'undefined') {
  require('cross-fetch/polyfill')
}

const zlFetch = (url, options) => {
  const requestOptions = createRequestOptions(Object.assign({ url }, options))

  if (options?.logRequestOptions) logRequestOptions(requestOptions)

  return fetch(requestOptions.url, requestOptions)
    .then(response => handleResponse(response, options))
    .catch(handleError)
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

function logRequestOptions (requestOptions) {
  const clone = Object.assign({}, requestOptions)
  const headers = {}
  for (const [header, value] of clone.headers) {
    headers[header] = value
  }
  clone.headers = headers
  console.log('Request options:', clone)
}

export default zlFetch
