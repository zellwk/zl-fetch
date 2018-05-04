const t = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(t)
const zlFetch = require('../dist/index')
const handlers = zlFetch.handlers
const sinon = require('sinon')

test('handleResponse', async (t) => {
  t.plan(2)
  // calls handleJSON if JSON
  let stub = sinon.stub(handlers, 'handleJSON').returns(true)
  let response = {
    headers: {
      get () {
        return 'application/json'
      }
    }
  }
  await zlFetch.handleResponse(response)
  t.equal(stub.calledOnce, true, 'calls handleJSON for JSON content type')
  stub.restore()

  // calls textResponseHandler if XML
  let stub2 = sinon.stub(handlers, 'handleText').returns(true)
  let response2 = {
    headers: {
      get () {
        return 'text/html'
      }
    }
  }
  await zlFetch.handleResponse(response2)
  t.equal(stub.calledOnce, true, 'calls handleText for Text content type')
  stub2.restore()

  t.end()
})
