# zlFetch

<!-- [![](https://data.jsdelivr.com/v1/package/npm/zl-fetch/badge)](https://www.jsdelivr.com/package/npm/zl-fetch) -->

## Features

1.  zlFetch includes helpers for creating your request. Including:
    1.  Query parameters
    2.  Authorization
    3.  Converts `body` to JSON if you're sending JSON data
    4.  Converts `body` to a valid query string if you're sending `x-www-form-urlencoded`
2.  zlFetch helps transforms a fetch request.
    1.  Use your responses in the first `then` method.
    2.  Directs 400 and 500 errors into the `catch` method.

## Download/install

You can install zlFetch through npm or yarn.

```
# Installing through npm
npm install zl-fetch --save

# Installing through yarn
yarn add zl-fetch
```

If you want to use zlFetch in your browser, download [`dist/index.min.js`](https://www.jsdelivr.com/package/npm/zl-fetch) or use the CDN link below:

```html
<script src="https://cdn.jsdelivr.net/npm/zl-fetch@2.1.5"></script>
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
require("isomorphic-fetch");
const zlFetch = require("zl-fetch");

zlFetch("http://some-random-website.com")
  .then(r => console.log(r))
  .catch(e => console.log(e));
```

## Quick Start

zlFetch transforms fetch responses for you. You can use the response from the server in the first `then` chain. If the response is an error, zlFetch directs it to the `catch` chain.

```js
zlFetch("http://some-website.com")
  .then(response => {
    const headers = response.headers;
    const body = response.body;
  })
  .catch(error => {
    const headers = error.headers;
    const body = error.body;
    const status = error.status;
  });
```

These properties are available in the response object:

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
    param1: 'value1',
    param2: 'to encode'
  }
})

// Result
fetch('http://some-website.com?param1=value1&param2=to%20encode')
```

## Sending `POST` requests

Set `method` to `post` to send a post request. zlFetch will set `Content-Type` will be set to `application/json` for you. Set the `content-type` header yourself if you wish to send other content types.

If `Content-Type` is `application/json`, zlFetch will convert the body to JSON.

```js
// with zlFetch
zlFetch("http://some-website.com", {
  method: "post"
});

// Resultant fetch api
fetch("http://some-website.com", {
  method: "post",
  headers: { "Content-Type": "application/json" }
});

// Setting other content type
zlFetch("http://some-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});
```

If `Content-Type` is `application/json`, zlFetch will convert the body to JSON.

```js
// with zlFetch
zlFetch("http://some-website.com", {
  method: "post",
  body: {
    key: "value"
  }
});

// Resultant fetch
fetch("http://some-website.com", {
  method: "post",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    key: "value"
  })
});
```

If `Content-Type` is `application/x-www-form-urlencoded`, zlFetch will convert the body to a query string.

```js
// with zlFetch
zlFetch("http://some-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: {
    key: "value",
    web: "https://google.com"
  }
});

fetch("http://some-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "key=value&web=https%3A%2F%2Fgoogle.com"
});
```

## Authentication

zlFetch adds `Authorization` headers for you if include any of these options:

1.  `username`
2.  `password`
3.  `token`

**Basic authentication:**

If you use zlFetch in Node, make sure you install [btoa](https://www.npmjs.com/package/btoa). No need to require it. zlFetch will handle it for you.

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

zlFetch supports only `json` and `text` response types for now. If you run into an error with a response type, file an issue and I'll support it asap.
