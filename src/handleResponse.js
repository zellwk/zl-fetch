const parseJSON = response =>
  response.json()
    .then(body => formatOutput(response, body))

const parseText = response =>
  response.text()
    .then(body => formatOutput(response, body))

const parseBlob = response =>
  response.blob()
    .then(body => formatOutput(response, body))

const getHeaders = response => {
  const headers = {}

  // window.fetch response headers contains entries method.
  if (response.headers.entries) {
    for (let [header, value] of response.headers.entries()) {
      headers[header] = value
    }
  } else {
    // Node fetch response headers does not contain entries method.
    // Format response headers for output
    const h = response.headers._headers
    for (const header in h) {
      headers[header] = h[header].join('')
    }
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
  if (type.includes('json')) return parseJSON(response)
  if (type.includes('text')) return parseText(response)
  if (type.includes('image')) return parseBlob(response)

  // Need to check for FormData, Blob and ArrayBuffer content types
  throw new Error(`zlFetch does not support content-type ${type} yet`)
}

module.exports = handleResponse
