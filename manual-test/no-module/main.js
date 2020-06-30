/* globals zlFetch */
zlFetch('https://api.github.com').then((response) =>
  console.log(response.body)
)
