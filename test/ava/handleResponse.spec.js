/* globals Headers */
import 'isomorphic-fetch'
import test from 'ava'
import sinon from 'sinon'
import handlers from '../../src/handleResponse.js'

test('runs parseJSON', t => {
  const stub = sinon.stub(handlers, 'parseJSON').returns(true)
  const response = {
    headers: new Headers({ 'content-type': 'application/json' })
  }

  handlers.handleResponse(response)
  t.true(stub.calledOnce)
  stub.restore()
})

test('runs parseText', t => {
  const stub = sinon.stub(handlers, 'parseText').returns(true)
  const response = {
    headers: new Headers({ 'content-type': 'text/html' })
  }

  handlers.handleResponse(response)
  t.true(stub.calledOnce)
  stub.restore()
})

// How do I make sure the JSON method gets called? Stubbing?
// test('parseJSON ok', async t => {
//   const response = {
//     headers: new Headers(),
//     body: JSON.stringify({ 'key': 'value' })
//     json: function ()
//   }

//   const test = await handlers.parseJSON(response)
//   console.log(test)
// })
