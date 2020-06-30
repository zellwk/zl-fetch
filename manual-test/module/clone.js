import zlFetch from '../../dist/index.mjs'

const createListOfRepos = results => {
  const list = document.createDocumentFragment('ul')
  for (let i = 0; i < results.length; i++) {
    const repo = results[i]
    const item = document.createElement('li')
    item.textContent = `${repo.name} (${repo.full_name}), 🌟 ${repo.stargazers_count}`
    list.appendChild(item)
  }
  return list
}

// Response.clone should work on supported browsers.
export default zlFetch('https://api.github.com/users/zellwk/repos')
  .then(async ({ response }) => {
    const clone = await response.clone()
    console.log('Success: clone', clone)
    // append to document
    const repos = await clone.json()
    const container = document.getElementById('repos')
    const list = createListOfRepos(repos)
    container.appendChild(list)
  })
  .catch(err => {
    console.log('Failure: clone')
    console.error(err)
  })
