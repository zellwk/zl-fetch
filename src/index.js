/* globals fetch */
import createRequestOptions from './createRequestOptions.js'
import { handleResponse, handleError } from './handleResponse.js'

export default function zlFetch (url, options) {
  return fetchInstance({ url, ...options })
}

/**
 * Main zlFetch Function
 * @param {string} url - endpoint
 * @param {object} options - zlFetch options
 * @param {string} options.method - HTTP method
 * @param {object} options.headers - HTTP headers
 * @param {object} options.body - Body content
 * @param {string} options.auth - Authentication information
 * @param {string} options.logRequestOptions - Logs the request options for debbuging
 * @param {string} options.autoReject - Automatically rejects the promise if the response is not ok
 */

// Normalizes between Browser and Node Fetch
export async function getFetch () {
  if (typeof fetch === 'undefined') {
    const f = await import('node-fetch')
    return {
      fetch: f.default,
      Headers: f.Headers,
      Request: f.Request
    }
  } else {
    return {
      fetch,
      Headers,
      Request
    }
  }
}

async function fetchInstance (options) {
  const fetch = await getFetch()
  const requestOptions = createRequestOptions({ ...options, fetch })

  // Remove options that are not native to a fetch request
  delete requestOptions.fetch
  delete requestOptions.auth
  delete requestOptions.logRequestOptions
  delete requestOptions.debug
  delete requestOptions.autoReject

  // Performs the fetch request
  return fetch
    .fetch(requestOptions.url, requestOptions)
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
// function zlFetch (url, options) {
//   const requestOptions = createRequestOptions(Object.assign({ url }, options))

//   if (options?.logRequestOptions) logRequestOptions(requestOptions)

//   return fetch(requestOptions.url, requestOptions)
//     .then(response => handleResponse(response, options))
//     .catch(handleError)
// }

// function logRequestOptions (requestOptions) {
//   const clone = Object.assign({}, requestOptions)
//   const headers = {}
//   for (const [header, value] of clone.headers) {
//     headers[header] = value
//   }
//   clone.headers = headers
// }

// export default zlFetch
