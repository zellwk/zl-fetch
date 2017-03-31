const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const zlFetch = require('../dist/index')
const handlers = zlFetch.handlers
const sinon = require('sinon')

test('handleResponse', async (t) => {
  t.plan(2)
  // calls JSONResponseHandler if JSON
  let stub = sinon.stub(handlers, 'JSONResponseHandler').returns(true)
  let response = {
    headers: {
      get () {
        return 'application/json'
      }
    }
  }
  await zlFetch.handleResponse(response)
  t.equal(stub.calledOnce, true, 'calls JSONResponseHandler for JSON content type')
  stub.restore()

  // calls textResponseHandler if XML
  let stub2 = sinon.stub(handlers, 'textResponseHandler').returns(true)
  let response2 = {
    headers: {
      get () {
        return 'text/html'
      }
    }
  }
  await zlFetch.handleResponse(response2)
  t.equal(stub.calledOnce, true, 'calls textResponseHandler for JSON content type')
  stub2.restore()

  t.end()
})
