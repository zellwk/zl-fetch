/* global fetch */

const parseOptions = require('./parseOptions')
const { handleResponse } = require('./handleResponse')

module.exports = (url, options = undefined) => {
  return fetch(url, parseOptions(options))
    .then(handleResponse)
}
