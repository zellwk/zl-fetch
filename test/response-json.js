const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const { handleJSON } = require('../dist/index').handlers

test('Handle JSON response', async (tape) => {
  const data = { data: 'data' }
  const response = {
    ok: true,
    status: 200,
    json: function () {
      return Promise.resolve(data)
    }
  }

  const result = await handleJSON(response)
  tape.equal(result, data, 'return JSON object if ok')
  tape.end()
})

test('Handle JSON error', async (tape) => {
  const data2 = { err: 'There is an error' }
  const response2 = {
    ok: false,
    status: 400,
    statusText: 'Bad Request',
    json: function () {
      return Promise.resolve(data2)
    }
  }

  try {
    await handleJSON(response2)
  } catch (e) {
    tape.equal(e.status, 400, 'should return status')
    const expected = {
      err: 'There is an error',
      status: 400,
      statusText: 'Bad Request'
    }
    tape.deepEqual(e, expected)
  }
  tape.end()
})
