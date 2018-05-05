import test from 'ava'

function delay (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

test('litmus', async t => {
  await delay(100)
  t.true(true)
})
