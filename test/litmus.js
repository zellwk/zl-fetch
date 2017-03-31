const _test = require('tape')
const tapePromise = require('tape-promise').default
const test = tapePromise(_test)

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
