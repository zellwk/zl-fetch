export function handleResponse (response, options) {
  // Lets user use custom response parser because some people want to do so.
  // See https://github.com/zellwk/zl-fetch/issues/2
  if (options && 'customResponseParser' in options) {
    return response
  }

  const type = response.headers.get('content-type')

  if (!type) return formatOutput(response, null) // Handles 204 No Content
  if (type.includes('json')) return parseResponse(response, 'json')
  if (type.includes('text')) return parseResponse(response, 'text')
  if (type.includes('image')) return parseResponse(response, 'blob')
  if (type.includes('x-www-form-urlencoded')) {
    return parseResponse(response, 'formData')
  }

  // Need to check for FormData, Blob and ArrayBuffer content types
  throw new Error(`zlFetch does not support content-type ${type} yet`)
}

/**
 * Formats all errors into zlFetch style error
 * @param {Object} error - The error object
 */
export function handleError (error) {
  if (error.message === 'Failed to fetch') {
    /* eslint-disable */
    return Promise.reject({ error })
    /* eslint-enable */
  }
  return Promise.reject(error)
}

// ========================
// Internal Functions
// ========================
async function parseResponse (response, type) {
  // Parse form data into JavaScript object
  // TODO: Create test for formData format
  if (type === 'formData') {
    let body = await response.text()
    if (typeof URLSearchParams !== 'undefined') {
      const query = new URLSearchParams(body)
      body = Object.fromEntries(query)
    } else {
      const querystring = require('querystring')
      body = querystring.parse(body)
    }
    return formatOutput(response, body)
  }

  // We use bracket notation to allow multiple types to be parsed at the same time.
  const body = await response[type]()
  return formatOutput(response, body)
}

function formatOutput (response, body) {
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

function getHeaders (response) {
  return response.headers.entries
    ? getBrowserFetchHeaders(response)
    : getNodeFetchHeaders(response)
}

// window.fetch response headers contains entries method.
function getBrowserFetchHeaders (response) {
  const headers = {}
  for (const [header, value] of response.headers.entries()) {
    headers[header] = value
  }
  return headers
}

// Node fetch response headers does not contain entries method.
function getNodeFetchHeaders (response) {
  const headers = {}
  const h = response.headers._headers
  for (const header in h) {
    headers[header] = h[header].join('')
  }
  return headers
}
