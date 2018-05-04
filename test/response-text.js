const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const { handleText } = require('../dist/index').handlers

test('Handle text response', async (tape) => {
  // test 1
  const text = 'yay'
  const response = {
    ok: true,
    status: 200,
    text: function () {
      return Promise.resolve(text)
    }
  }

  const result = await handleText(response)
  tape.equal(result, text)
  tape.end()
})

test('Handle text error', async (tape) => {
  const text = 'yay'
  const response2 = {
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    text: function () {
      return Promise.resolve(text)
    }
  }

  try {
    await handleText(response2)
  } catch (e) {
    const expected = {
      err: 'yay',
      status: 401,
      statusText: 'Unauthorized'
    }
    tape.deepEqual(e, expected)
  }

  tape.end()
})
