import zlFetch from '../dist/index.mjs'
// Should work with Open Dota API. (Doesn't fail pre-flight checks)
export default zlFetch('https://api.opendota.com/api/heroStats', {
  headers: {}
})
  .then(res => {
    console.log('Success: Preflight', res)
  })
  .catch(err => {
    console.log('Failure: Preflight')
    console.error(err)
  })
