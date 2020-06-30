import zlFetch from '../../dist/index.mjs'

const createListOfStats = results => {
  const list = document.createDocumentFragment('ul')
  for (let i = 0; i < results.length; i++) {
    const stat = results[i]
    const item = document.createElement('li')
    item.textContent = `${stat.localized_name}, 📈 ${stat.pro_win} %`
    list.appendChild(item)
  }
  return list
}

// Should work with Open Dota API. (Doesn't fail pre-flight checks)
export default zlFetch('https://api.opendota.com/api/heroStats', {
  headers: {}
})
  .then(async res => {
    console.log('Success: Preflight', res)
    // append to document
    const stats = res.body
    const container = document.getElementById('stats')
    const list = createListOfStats(stats)
    container.appendChild(list)
  })
  .catch(err => {
    console.log('Failure: Preflight')
    console.error(err)
  })
