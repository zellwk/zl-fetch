const parseResponse = (response, type) =>
  response[type]()
    .then(body => formatOutput(response, body))

const getHeaders = response => {
  return response.headers.entries
    ? getBrowserFetchHeaders(response)
    : getNodeFetchHeaders(response)
}

// window.fetch response headers contains entries method.
const getBrowserFetchHeaders = response => {
  const headers = {}
  for (let [header, value] of response.headers.entries()) {
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

const handleResponse = response => {
  const type = response.headers.get('content-type')
  if (type.includes('json')) return parseResponse(response, 'json')
  if (type.includes('text')) return parseResponse(response, 'text')
  if (type.includes('image')) return parseResponse(response, 'blob')

  // Need to check for FormData, Blob and ArrayBuffer content types
  throw new Error(`zlFetch does not support content-type ${type} yet`)
}

module.exports = handleResponse
