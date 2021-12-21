/* globals fetch */
import createRequestOptions from './createRequestOptions'
import { handleResponse, handleError } from './handleResponse'

if (typeof fetch === 'undefined') {
  require('cross-fetch/polyfill')
}

const zlFetch = (url, options) => {
  // console.log('testing')
  const opts = createRequestOptions(Object.assign({ url }, options))
  return fetch(opts.url, opts)
    .then(handleResponse)
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

export default zlFetch
