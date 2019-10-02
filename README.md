<!-- Breaking Changes -->
<!-- 1. params -> queries -->
<!-- 2. Authorization -->
<!-- 3. No need to require btoa anymore -->
<!-- 4. Shorthands -->

# zlFetch

<!-- [![](https://data.jsdelivr.com/v1/package/npm/zl-fetch/badge)](https://www.jsdelivr.com/package/npm/zl-fetch) -->

## Features

1.  zlFetch helps you create your request. It helps you:
    1. Create query parameters for GET requests
    2. Do Basic and Bearer-type authorization
    3. Formats `body` for JSON or `x-www-form-urlencoded`
2.  zlFetch transforms the response:
    1.  It lets you use your responses in the first `then` method.
    2.  It directs 400 and 500 errors into `catch`.

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
zlFetch("http://your-website.com")
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

You can use import zlFetch the ES6 way if you wish to:

```js
// ES6 imports
import zlFetch from "zl-fetch";
zlFetch("http://your-website.com")
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

Fetch is supported natively in modern browsers. If you need to support older browsers, add [ismorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) in your code. zlFetch does not include `isomorphic-fetch` for you.


### Basic usage (in Node)

zlFetch requires [ismorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) in Node based environments. Then, use `zlFetch` as normal.

```
npm install -S isomorphic-fetch
```

```js
const zlFetch = require("zl-fetch");
zlFetch("http://your-website.com")
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## Response and Error objects

`zlFetch` changes the response and error objects. In zlFetch, `response` and `error` objects both include these five properties:

1.  `headers`: response headers
2.  `body`: response body
3.  `status`: response status
4.  `statusText`: response status text
5.  `response`: original response from Fetch

```js
zlFetch("http://your-website.com")
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

## `GET` requests

To send a `GET` request, enter the endpoint as the first argument.

```js
// With zlFetch
zlFetch("http://your-website.com");

// With fetch api
fetch("http://your-website.com");
```

zlFetch formats and encodes query parameters for you if you provide a `queries` option.

```js
zlFetch('http://your-website.com', {
  queries: {
    param1: 'value1',
    param2: 'to encode'
  }
})

// With fetch API
fetch('http://your-website.com?param1=value1&param2=to%20encode')
```

## `POST` requests

Set `method` to `post` to send a post request. zlFetch will set `Content-Type` will be set to `application/json` for you. It will also convert your `body` to a JSON string automatically.

```js
// with zlFetch
zlFetch("http://your-website.com", {
  method: "post",
  body: {
    key: "value"
  }
});

// Resultant fetch api
fetch("http://your-website.com", {
  method: "post",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    key: "value"
  })
});

// Setting other content type
zlFetch("http://your-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});
```

### Other Content-Types

You may choose to overwrite `Content-Type` yourself. To do so, pass `headers` and `Content-Type` property.

```js
fetch("http://your-website.com", {
  method: "post",
  headers: { "Content-Type": "Another Content Type" },
  body: {
    key: "value"
  )
});
```

If `Content-Type` is set to `application/x-www-form-urlencoded`, zlFetch will format `body` to be valid for `x-www-form-urlencoded`.

```js
zlFetch("http://your-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: {
    key: "value",
    web: "https://google.com"
  }
});

// Resultant fetch api
fetch("http://your-website.com", {
  method: "post",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "key=value&web=https%3A%2F%2Fgoogle.com"
});
```

## Authentication/Authorization

zlFetch adds `Authorization` headers for you if you include an `auth` property.

```js
zlFetch("http://your-website.com", {
  auth: /* Your credentials */
})
```

### Basic Authentication

To perform basic authentication, pass `username` and `password` into `auth`.

```js
zlFetch("http://your-website.com", {
  auth: {
    username: 'your-username'
    password: 'your-password'
  }
})

// Resultant fetch api
fetch("http://your-website.com", {
  headers: { Authorization: `Basic ${btoa("yourusername:12345678")}` }
});
```


### Token/Bearer Authentication

To perform token-based authentication, pass your token into `auth`.

```js
zlFetch("http://your-website.com", {
  token: "token12345"
});

// Resultant fetch api
fetch("http://your-website.com", {
  headers: { Authorization: `Bearer token12345` }
});
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
zlFetch.post('http://your-website.com')
zlFetch('http://your-website.com', { method: 'post' })
```

## Response Types

zlFetch supports only `json` and `text` response types for now. If you run into an error with a response type, file an issue and I'll support it asap. (This might take time though!)
