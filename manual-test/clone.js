import zlFetch from '../dist/index.mjs'

// Response.clone should work on supported browsers.
export default zlFetch('https://api.github.com/users/zellwk/repos')
  .then(async ({ response }) => {
    const clone = await response.clone()
    console.log('Success: clone', clone)
  })
  .catch(err => {
    console.log('Failure: clone')
    console.error(err)
  })
