// window.fetch response headers contains entries method.
const getBrowserFetchHeaders = response => {
  const headers = {}
  for (const [header, value] of response.headers.entries()) {
    headers[header] = value
  }
  return headers
}

// Node fetch response headers does not contain entries method.
const getNodeFetchHeaders = response => {
  const headers = {}
  const h = response.headers._headers
  for (const header in h) {
    headers[header] = h[header].join('')
  }
  return headers
}

const getHeaders = response => {
  return response.headers.entries
    ? getBrowserFetchHeaders(response)
    : getNodeFetchHeaders(response)
}

const formatOutput = (response, body) => {
  const headers = getHeaders(response)
  const returnValue = {
    body,
    headers,
    response,
    status: response.status,
    statusText: response.statusText
  }

  return response.ok
    ? Promise.resolve(returnValue)
    : Promise.reject(returnValue)
}

const parseResponse = (response, type) => {
  // We use bracket notation to allow multiple types to be parsed at the same time.
  return response[type]().then(body => formatOutput(response, body))
}

export const handleResponse = (response, options) => {
  // Allows user to use a custom response parser.
  // We do this because of two reasons. First, this lets users parse responses that zlFetch doesn't support.
  // Second, we do this because we to avoid cloning the response. Why? Some users want to use the response object, which prompted a `clone` in the first place. Unfortunately, we run into an error regarding cloning in Node when the response is large.  The issue happens because Node has a lower internal buffer size. Trying to response.clone() things in Node may end up hanging the process. That's why we don't use `clone`. If the user wants to, we provide them with the option to use a custom parser instead. (Adding highWaterMark does nothing to resolve the problem).
  // More info: https://github.com/node-fetch/node-fetch/blob/main/README.md#custom-highwatermark
  if (options && 'customResponseParser' in options) {
    return response
  }

  const type = response.headers.get('content-type')

  if (type.includes('json')) return parseResponse(response, 'json')
  if (type.includes('text')) return parseResponse(response, 'text')
  if (type.includes('image')) return parseResponse(response, 'blob')

  // Need to check for FormData, Blob and ArrayBuffer content types
  throw new Error(`zlFetch does not support content-type ${type} yet`)
}

/**
 * Formats all errors into zlFetch style error
 * @param {Object} error - The error object
 */
export const handleError = error => {
  if (error.message === 'Failed to fetch') {
    /* eslint-disable */
    return Promise.reject({ error })
    /* eslint-enable */
  }
  return Promise.reject(error)
}
