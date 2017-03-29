function zlfetch ({
  url,
  method = 'GET',
  token = null,
  body = {},
}) {
  let options = {
    headers: {'Content-Type': 'application/json'},
    method: method
  }
  if (token) options.headers.Authorization = 'Bearer ' + token
  if (!isEmptyObject(body)) options.body = JSON.stringify(body)

  return fetch(url, options).then(response => {
    return response.json().then(json => {
      return response.ok ? json : Promise.reject({
        err: json,
        statusCode: response.status
      })
    })
  })
}

function isEmptyObject (obj) {
  return (Object.getOwnPropertyNames(obj).length === 0)
}

module.exports = zlfetch

