/* global zlFetch */

// Should work with Open Dota API. (Doesn't fail pre-flight checks)
export default zlFetch('https://api.opendota.com/api/heroStats', {
  headers: {}
}).then(console.log)
  .then(res => {
    console.log(res)
    console.log('Success: Preflight')
  })
  .catch(err => {
    console.log('Failure: Preflight')
    console.error(err)
  })
