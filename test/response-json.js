const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const handlers = require('../dist/index').handlers

test('Handle JSON response', async (tape) => {
  let data = {data: 'data'}
  let response = {
    ok: true,
    status: 200,
    json: function () {
      return Promise.resolve(data)
    }
  }

  let result = await handlers.JSONResponseHandler(response)
  tape.equal(result, data, 'return JSON object if ok')

  tape.end()
})

test('Handle JSON error', async (tape) => {
  let data2 = {err: 'THERE IS A FUCKING ERROR'}
  let response2 = {
    ok: false,
    status: 400,
    json: function () {
      return Promise.resolve(data2)
    }
  }

  try {
    await handlers.JSONResponseHandler(response2)
  } catch (e) {
    tape.equal(e.status, 400, 'should return status')
    // Deprecated statusCode
    tape.equal(e.statusCode, 400, 'should return statusCode')

    let expected = {
      status: 400,
      statusCode: 400,
      err: 'THERE IS A FUCKING ERROR'
    }
    tape.deepEqual(e, expected, 'should return error object in addition to status')
  }
  tape.end()
})
