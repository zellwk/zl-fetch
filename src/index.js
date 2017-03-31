/* global fetch */
export default function zlFetch (url, options = undefined) {
  return fetch(url, optionsHandler(options))
    .then(responseHandler)
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

  if (objectHasKey(options, 'body') && !objectIsEmpty(options.body)) {
    delete r.body
    r.body = JSON.stringify(options.body)
  }

  return r
}

// http://stackoverflow.com/questions/29473426/fetch-reject-promise-with-json-error-object/32488827
export function responseHandler (response) {
  return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject({
          statusCode: response.status,
          err: json
        })
      }
    })
}

function objectIsEmpty (obj) {
  return (Object.getOwnPropertyNames(obj).length === 0)
}

function objectHasKey (o, prop) {
  return o.hasOwnProperty(prop)
}
