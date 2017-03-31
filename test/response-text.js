const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const handlers = require('../dist/index').handlers

test('textResponseHandler', async (tape) => {
  tape.plan(2)
  // test 1
  let text = 'yay'
  let response = {
    ok: true,
    status: 200,
    text: function () {
      return Promise.resolve(text)
    }
  }

  let result = await handlers.textResponseHandler(response)
  tape.equal(result, text, 'return text if ok')

  // test 2
  let expected = {
    err: 'Unauthorized',
    statusCode: 401
  }

  let response2 = {
    ok: false,
    status: expected.statusCode,
    statusText: expected.err
  }

  try {
    await handlers.textResponseHandler(response2)
  } catch (e) {
    tape.deepEqual(e, expected, 'return {err, statusCode} if not ok')
  }

  tape.end()
})
