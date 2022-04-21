<!-- Breaking Changes -->
<!-- 1. params -> queries -->
<!-- 2. Authorization -->
<!-- 3. No need to require btoa anymore -->
<!-- 4. Shorthands -->

# zlFetch

<!-- [![](https://data.jsdelivr.com/v1/package/npm/zl-fetch/badge)](https://www.jsdelivr.com/package/npm/zl-fetch) -->

## Features

1. zlFetch helps you create your request. It helps you:
   1. Create query parameters for GET requests
   2. Do Basic and Bearer-type authorization
   3. Formats `body` for JSON or `x-www-form-urlencoded`
2. zlFetch transforms the response:
   1. It lets you use your responses in the first `then` method.
   2. It directs 400 and 500 errors into `catch`.

## Download/install

You can install zlFetch through npm.

```
# Installing through npm
npm install zl-fetch --save
```

If you want to use zlFetch in your browser, download [`dist/index.min.js`](https://www.jsdelivr.com/package/npm/zl-fetch) or use the CDN link below:

```html
<script src="https://cdn.jsdelivr.net/npm/zl-fetch"></script>
```

## Quick Start

### Basic usage (in Browser)

```js
// Basic usage
zlFetch('url')
  .then(response => console.log(response))
  .catch(error => console.log(error))
```

You can use import zlFetch the ES6 way if you wish to:

```js
// ES6 imports
import zlFetch from 'zl-fetch'
zlFetch('url')
  .then(response => console.log(response))
  .catch(error => console.log(error))
```

### Basic usage (in Node)

You use it the same way you expect to with browsers!

```js
const zlFetch = require('zl-fetch')
zlFetch('url')
  .then(response => console.log(response))
  .catch(error => console.log(error))
```

## Response and Error objects

`zlFetch` changes the response and error objects. In zlFetch, `response` and `error` objects both include these five properties:

1. `headers`: response headers
2. `body`: response body
3. `status`: response status
4. `statusText`: response status text
5. `response`: original response from Fetch

```js
zlFetch('url')
  .then(response => {
    const headers = response.headers
    const body = response.body
  })
  .catch(error => {
    const headers = error.headers
    const body = error.body
    const status = error.status
  })
```

## `GET` requests

To send a `GET` request, enter the endpoint as the first argument.

```js
// With zlFetch
zlFetch('url')

// With fetch api
fetch('url')
```

zlFetch formats and encodes query parameters for you if you provide a `queries` option.

```js
zlFetch('url', {
  queries: {
    param1: 'value1',
    param2: 'to encode'
  }
})

// With fetch API
fetch('url?param1=value1&param2=to%20encode')
```

## `POST` requests

Set `method` to `post` to send a post request. zlFetch will set `Content-Type` will be set to `application/json` for you. It will also convert your `body` to a JSON string automatically.

```js
// with zlFetch
zlFetch('url', {
  method: 'post',
  body: {
    key: 'value'
  }
})

// Resultant fetch api
fetch('url', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'value'
  })
})

// Setting other content type
zlFetch('url', {
  method: 'post',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
```

### Other Content-Types

You may choose to overwrite `Content-Type` yourself. To do so, pass `headers` and `Content-Type` property.

```js
fetch("url", {
  method: "post",
  headers: { "Content-Type": "Another Content Type" },
  body: {
    key: "value"
  )
});
```

If `Content-Type` is set to `application/x-www-form-urlencoded`, zlFetch will format `body` to be valid for `x-www-form-urlencoded`.

```js
zlFetch('url', {
  method: 'post',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: {
    key: 'value',
    web: 'https://google.com'
  }
})

// Resultant fetch api
fetch('url', {
  method: 'post',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'key=value&web=https%3A%2F%2Fgoogle.com'
})
```

## Authentication/Authorization

zlFetch adds `Authorization` headers for you if you include an `auth` property.

```js
zlFetch("url", {
  auth: /* Your credentials */
})
```

### Basic Authentication

To perform basic authentication, pass `username` and `password` into `auth`.

```js
zlFetch("url", {
  auth: {
    username: 'your-username'
    password: 'your-password'
  }
})

// Resultant fetch api
fetch("url", {
  headers: { Authorization: `Basic ${btoa("yourusername:12345678")}` }
});
```

### Token/Bearer Authentication

To perform token-based authentication, pass your token into `auth`.

```js
zlFetch('url', {
  auth: 'token12345'
})

// Resultant fetch api
fetch('url', {
  headers: { Authorization: `Bearer token12345` }
})
```

## Shorhand methods

From `v3.0` onwards, zlFetch supports method shorthands.

Supported shorthand methods include:

1. `get`
2. `post`
3. `put`
4. `patch`
5. `delete`

```js
// These two are the same
zlFetch.post('url')
zlFetch('url', { method: 'post' })
```

## Logging request options

From v3.4.1 onwards, zlFetch supports logging request options. You can use it to debug your requests. zlFetch will log the request options into the console for you.

```js
zlFetch('url', {
  // ...
  logRequestOptions: true
})
```

## Handling other Response Types

zlFetch only supports `json`,`blob`, and `text` response types at this point. (PRs welcome if you want to help zlFetch handle more response types!).

If you want to handle a response not supported by zlFetch, you can pass `customResponseParser: true` into the options. This returns the response from a normal Fetch request without any additional treatments from zlFetch. You can then use `response.json()` or other methods as you deem fit.

```js
const response = await zlFetch('url', {
  customResponseParser: true
})
const data = await response.arrayBuffer()
```
