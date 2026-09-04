import createRequestOptions from './createRequestOptions.js'
import { handleError, handleResponse } from './handleResponse.js'

/**
 * zlFetch's own options. Anything else you pass goes to Fetch untouched.
 *
 * @typedef {object} ZlFetchOwnOptions
 * @property {string} [method='GET'] - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @property {object} [query] - Query parameters object (alternative to queries)
 * @property {object} [queries] - Query parameters object (alternative to query)
 * @property {object} [params] - Query parameters object (alternative to query/queries)
 * @property {object} [param] - Query parameters object (alternative to query/queries/params)
 * @property {object} [headers] - HTTP headers to send with the request
 * @property {object|string|FormData} [body] - Request body. Can be an object (JSON), string (form-urlencoded), or FormData
 * @property {string|object} [auth] - Authentication information. String for Bearer token, object for Basic auth
 * @property {boolean} [stream=false] - When true, detects and decodes a streamed response
 * @property {boolean} [debug=false] - When true, includes debug information in the response
 * @property {boolean} [returnError=false] - When true, resolves to a ZlFetchReturnError instead of rejecting
 * @property {boolean} [customResponseParser=false] - When true, resolves to the raw Response without parsing
 * @property {AbortController} [controller] - Abort controller to use instead of the one zlFetch creates
 * @property {AbortSignal} [signal] - Abort signal to use instead of the controller's own
 */

/**
 * @typedef {Omit<RequestInit, 'body' | 'headers' | 'method' | 'signal'> & ZlFetchOwnOptions} ZlFetchOptions
 */

/**
 * What a request resolves to. Rejects with this same shape on a 400 or 500.
 *
 * @typedef {object} ZlFetchResponse
 * @property {*} body - Parsed response body (JSON, NDJSON, text, blob, or a decoded stream)
 * @property {object} headers - Response headers
 * @property {Response} response - Original fetch Response object
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {() => void} abort - Aborts the request
 * @property {object} [debug] - Request options, present when the debug option is set
 */

/**
 * What a request resolves to when returnError is set. One field carries the response, the other is null.
 *
 * @typedef {object} ZlFetchReturnError
 * @property {ZlFetchResponse|null} response - The response when the request succeeded
 * @property {ZlFetchResponse|null} error - The response when the request failed
 */

/**
 * The promise zlFetch hands back. Carries abort() so you can cancel before it settles. customResponseParser is checked first because it returns the response before createOutput runs, which leaves returnError with nothing to act on.
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @typedef {Promise<O extends { customResponseParser: true } ? Response : O extends { returnError: true } ? ZlFetchReturnError : ZlFetchResponse> & { abort: () => void }} ZlFetchPromise
 */

/**
 * Main Fetch Function
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 * @throws {ZlFetchResponse} When the request fails and returnError is false
 */

export function coreFetch(url, options = {}) {
  const abortController = options.controller || new AbortController()
  const signal = options.signal || abortController.signal
  const instance = fetchInstance({ url, ...options, abortController, signal })
  instance.abort = () => abortController.abort()

  return instance
}
// ========================
// Internal Functions
// ========================
async function fetchInstance(options) {
  const requestOptions = createRequestOptions(options)

  // Remove options that are not native to a fetch request
  delete requestOptions.fetch
  delete requestOptions.queries
  delete requestOptions.query
  delete requestOptions.params
  delete requestOptions.param
  delete requestOptions.auth
  delete requestOptions.debug
  delete requestOptions.returnError

  // Performs the fetch request
  return fetch(requestOptions.url, requestOptions)
    .then(response => handleResponse(response, options))
    .then(response => {
      if (options.signal) return response
      return response
    })
    .then(response => {
      if (!options.debug) return response
      return { ...response, debug: debugHeaders(requestOptions) }
    })
    .catch(handleError)
}

function debugHeaders(requestOptions) {
  const clone = Object.assign({}, requestOptions)
  const headers = {}
  for (const [header, value] of clone.headers) {
    headers[header] = value
  }
  clone.headers = headers
  return clone
}

// so it will be captured by ts

/**
 * coreFetch.get
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 */
coreFetch.get = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'get'
  })
}

/**
 * coreFetch.post
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 */
coreFetch.post = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'post'
  })
}

/**
 * coreFetch.put
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 */
coreFetch.put = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'put'
  })
}

/**
 * coreFetch.patch
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 */
coreFetch.patch = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'patch'
  })
}

/**
 * coreFetch.delete
 *
 * @template {ZlFetchOptions} [O=ZlFetchOptions]
 * @param {string} url - The endpoint URL to fetch from
 * @param {O} [options] - zlFetch options
 * @returns {ZlFetchPromise<O>}
 */
coreFetch.delete = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'delete'
  })
}
