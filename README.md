# zlFetch

<!-- Some badges to go here -->

<!-- [![](https://data.jsdelivr.com/v1/package/npm/zl-fetch/badge)](https://www.jsdelivr.com/package/npm/zl-fetch) -->

## Features

1.  zlFetch includes helpers for creating your request. Including:
    1.  Query parameters
    2.  Authorization
    3.  Sending JSON Data
2.  zlFetch helps transforms a fetch request.
    1.  Use your responses in the first `then` method.
    2.  Directs 400 and 500 errors into the `catch` method.

## Download/install

You install zlFetch through npm or yarn.

```
# Installing through npm
npm install zl-fetch --save

# Installing through yarn
yarn add zl-fetch
```

To use zlFetch directly in your browser, download [`dist/index.min.js` directly](https://www.jsdelivr.com/package/npm/zl-fetch) or use the CDN link .

```html
<script src="https://cdn.jsdelivr.net/npm/zl-fetch"></script>
```

### Basic usage (in Browser)

Make sure Fetch is supported. You can provide support with [ismorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) if you need to.

```js
// Basic usage
zlFetch("http://some-random-website.com")
  .then(r => console.log(r))
  .catch(e => console.log(e));
```

You can use ES6 import to import zlFetch too.

```js
// ES6 imports
import zlFetch from "zl-fetch";
```

### Basic usage (in Node)

zlFetch requires [ismorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) in Node based environments.

```js
require('isomorphic-fetch)
const zlFetch = require("zl-fetch");

zlFetch("http://some-random-website.com")
  .then(r => console.log(r))
  .catch(e => console.log(e));
```

## Quick Start

zlFetch transforms fetch responses for you. You can use the response from your server (or api) directly in the first `then` call. If

```js
zlFetch("http://some-website.com")
  .then(response => {
    const headers = response.headers;
    const body = response.body;
  })
  .catch(error => {
    const headers = response.headers;
    const body = response.body;
    const status = response.status;
  });
```

Response is an object. The available properties are:

1.  `headers`—response headers
2.  `body`—response body
3.  `status`—response status
4.  `statusText`—response status text
5.  `response`—original response from Fetch

## Sending `GET` requests

zlFetch performs a `GET` request by default. Enter a url as the first parameter.

```js
// With zlFetch
zlFetch("http://some-website.com");

// with fetch api
fetch("http://some-website.com");
```

zlFetch formats and encodes query parameters for you if you provide a params option.

```js
zlFetch('http://some-website.com', {
  params: {
    param1: 'value1'
    param2: 'to encode'
  }
})

// Result URL
// http://some-website.com?param1=value1&param2=to%20encode
```

## Sending `POST` requests

Set `method` to `post` to send a post request. `Content-Type` will be set to `application/json` automatically.

If `Content-Type` is `application/json`, body will be converted into JSON for you.

```js
// with zlFetch
zlFetch("http://some-website.com", {
  method: "post",
  body: {
    key: value
  }
});

// with fetch api
fetch("http://some-website.com", {
  method: "post",
  headers: { 'Content-Type': 'application/json' }
  body: JSON.stringify({
    key: value
  })
});
```

If you wish to send other content types, set your headers manually.

```js
zlFetch("http://some-website.com", {
  method: "post",
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  body: 'key=value'
});
```

## Authentication

zlFetch adds `Authorization` headers for you if `username`, `password` or `token` fields are found in the options.

**Basic authentication:**

Base64 encoding automatically in browsers.

If you execute zlFetch in a Node environment, make sure you have installed [btoa](https://www.npmjs.com/package/btoa). No need to require it. zlFetch will handle it for you.

```js
// with zlFetch
zlFetch("http://some-website.com", {
  username: "yourusername",
  password: "12345678"
});

// with fetch
fetch("http://some-website.com", {
  headers: { Authorization: `Basic ${btoa("yourusername:12345678")}` }
});
```

**Token based authentication:**

```js
// with zlFetch
zlFetch("http://some-website.com", {
  token: "token_12345"
});

// with fetch
fetch("http://some-website.com", {
  headers: { Authorization: `Bearer token_12345` }
});
```

## Options

zlFetch accepts the same options as Fetch, with these additional options:

```js
{
  // Query parameters
  params: {},

  // For authentication
  username: undefined,
  password: undefined,
  token: undefined
}
```

## Supported response types

zlFetch supports only `json` and `text` response types. More response types can be supported. If you run into an error with a response type, file an issue and I'll work on it asap.