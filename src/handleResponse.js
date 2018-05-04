module.exports = {
  formatPromise (response, body) {
    const headers = this.getHeaders(response)
    const returnValue = { headers, body }

    response.ok
      ? Promise.resolve(returnValue)
      : Promise.reject(Object.assign(returnValue, {
        statusText: response.statusText,
        status: response.status
      }))
  },
  getHeaders (response) {
    const headers = {}
    for (let [header, value] of r.headers.entries()) {
      headers[header] = value
    }
    return headers
  },

  handleResponse (response) {
    const type = response.headers.get('content-type')
    if (type.includes('application/json')) return this.parseJSON(response)
    if (
      type.includes('text/plain') ||
      type.includes('text/html')
    ) {
      return this.parseText(response)
    }

    // Need to check for FormData, Blob and ArrayBuffer content types
    throw new Error(`zlFetch does not support content-type ${type} yet`)
  },

  parseJSON (response) {
    return response.json()
      .then(body => this.formatPromise(response, body))
  },

  parseText (response) {
    const headers = this.getHeaders(response)
    return response.text()
      .then(body => this.formatPromise(response, body))
  }
}
