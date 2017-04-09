const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const handlers = require('../dist/index').handlers

test('Handle text response', async (tape) => {
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
  tape.end()
})

test('Handle text error', async (tape) => {
  let response2 = {
    ok: false,
    status: 401,
    statusText: 'Unauthorized'
  }

  try {
    await handlers.textResponseHandler(response2)
  } catch (e) {
    let expected = {
      err: 'Unauthorized',
      statusCode: 401,
      status: 401
    }
    tape.deepEqual(e, expected, 'return {err, statusCode} if not ok')
  }

  tape.end()
})
