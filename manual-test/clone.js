/* global zlFetch */
// Response.clone should work on supported browsers.
export default zlFetch('https://api.github.com/users/zellwk/repos')
  .then(({ response }) => {
    const clone = response.clone()
    console.log('Success: clone', clone)
  })
  .catch(err => {
    console.log('Failure: clone')
    console.error(err)
  })
