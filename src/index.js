/* global fetch */

export default function zlFetch (url, options = undefined) {
  return fetch(url, optionsHandler(options))
    .then(handleResponse)
}

export function optionsHandler (options) {
  let def = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }

  if (!options) return def

  let r = Object.assign({}, def, options)
  if (objectHasKey(options, 'token')) {
    delete r.token
    r.headers.Authorization = 'Bearer ' + options.token
  }

  delete r.body
  if (options.body) {
    if (!objectIsEmpty(options.body)) {
      r.body = JSON.stringify(options.body)
    }
  }

  return r
}

export const handlers = {
  JSONResponseHandler (response) {
    return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(Object.assign({}, {statusCode: response.status}, json))
      }
    })
  },
  textResponseHandler (response) {
    if (response.ok) {
      return response.text()
    } else {
      return Promise.reject(Object.assign({}, {statusCode: response.status}, {err: response.statusText}))
    }
  }
}

export function handleResponse (response) {
  let contentType = response.headers.get('content-type')
  if (contentType.includes('application/json')) {
    return handlers.JSONResponseHandler(response)
  } else if (contentType.includes('text/html')) {
    return handlers.textResponseHandler(response)
  } else {
    throw new Error(`Sorry, content-type ${contentType} not supported`)
  }
}

function objectIsEmpty (obj) {
  return (Object.getOwnPropertyNames(obj).length === 0)
}

function objectHasKey (o, prop) {
  return o.hasOwnProperty(prop)
}
