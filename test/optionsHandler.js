const test = require('tape')
const zlFetch = require('../dist/index')

test('optionsHandler', (tape) => {
  // Test 1
  let expected = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }
  let test = zlFetch.optionsHandler()
  tape.deepEqual(test, expected, 'handles undefined option')

  // Test 2
  let expected2 = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  }
  let test2 = zlFetch.optionsHandler({method: 'POST'})
  tape.deepEqual(test2, expected2, 'handles post method')

  // Test 3
  let expected3 = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + 'abc'
    }
  }
  let test3 = zlFetch.optionsHandler({token: 'abc'})
  tape.deepEqual(test3, expected3, 'handles token authorization')

  // test 4
  let body = {testing: 'testing'}
  let expected4 = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  }
  let test4 = zlFetch.optionsHandler({
    method: 'POST',
    body
  })
  tape.deepEqual(test4, expected4, 'stringifies body')

  // test 5
  let expected5 = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    mode: 'no-cors'
  }
  let test5 = zlFetch.optionsHandler({
    mode: 'no-cors'
  })
  tape.deepEqual(test5, expected5, 'retain all other options')

  tape.end()
})
