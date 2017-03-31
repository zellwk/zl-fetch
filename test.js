const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const zlFetch = require('./dist/index')

// Makes sure async works before stubbing stuff
test('ensure async works', async function (t) {
  await delay(100)
  t.true(true)
})

function delay (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

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

test('responseHandler', async (tape) => {
  tape.plan(2)

  // test 1
  let data = {data: 'data'}
  let response = {
    ok: true,
    status: 200,
    json: function () {
      return Promise.resolve(data)
    }
  }

  let result = await zlFetch.responseHandler(response)
  tape.equal(result, data, 'return JSON object if ok')

  // test 2
  let data2 = {err: 'THERE IS A FUCKING ERROR'}
  let response2 = {
    ok: false,
    status: 400,
    json: function () {
      return Promise.resolve(data2)
    }
  }

  try {
    await zlFetch.responseHandler(response2)
  } catch (e) {
    let result = {
      err: data2,
      statusCode: 400
    }
    tape.deepEqual(e, result, 'return {err, statusCode} if not ok')
  }

  tape.end()
})
