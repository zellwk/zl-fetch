const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const zlFetch = require('../dist/index')
const handlers = require('../dist/index').handlers

test('JSONResponseHandler', async (tape) => {
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

  let result = await handlers.JSONResponseHandler(response)
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
    await handlers.JSONResponseHandler(response2)
  } catch (e) {
    let result = {
      err: data2,
      statusCode: 400
    }
    tape.deepEqual(e, result, 'return {err, statusCode} if not ok')
  }
  tape.end()
})
