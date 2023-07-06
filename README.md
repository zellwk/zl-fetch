# zlFetch

zlFetch is a wrapper around fetch that provides you with a convenient way to make requests.

Note: From `v4.0.0` onwards, zlFetch is a ESM library. It cannot be used with CommonJS anymore.

It's features are as follows:

- Quality of life improvements over the native `fetch` function

  - [Use the response right away](#quick-start) without using `response.json()`, `response.text()`, or `response.blob()`
  - [Promise-like error handling](#error-handling) — all 400 and 500 errors are directed into the `catch` block automatically.
  - [Easy error handling when using `await`](#easy-error-handling-when-using-asyncawait) — errors can be returned so you don't have to write a `try/catch` block.

- Additional improvements over the native `fetch` function
  - `Content-Type` headers are set [automatically](#content-type-generation-based-on-body-content) based on the `body` content.
  - [Get everything you need](#the-response-contains-all-the-data-you-may-need) about your response — `headers`, `body`, `status`, and more.
  - [Debug your request](#debugging-the-request) without looking at the Network panel
  - Shorthand for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods
  - [Helper for generating query strings](#query-string-helpers) so you don't have to mess with query parameters.
  - [Generates authorization headers](#authorization-header-helpers) with an `auth` property.
  - [Create instances to hold url and options](#creating-a-zlfetch-instance) so you don't have to repeat yourself.

## Installing zlFetch

You can install zlFetch through npm:

```bash
# Installing through npm
npm install zl-fetch --save
```

Then you can use it by importing it in your JavaScript file. It works for both browsers and Node.

```js
import zlFetch from 'zl-fetch'
```

Using `zlFetch` without `npm`:

You can use `zlFetch` without `npm` by importing it directly to your HTML file. To do this, you first need to set your `script`'s type to `module`, then import `zlFetch` from a CDN jsdelivr.

```html
<script type="module">
  import zlFetch from 'https://cdn.jsdelivr.net/npm/zl-fetch@5.0.1/src/index.js'
</script>
```

## Quick Start

You can use zlFetch just like a normal `fetch` function. The only difference is you don't have to write a `response.json` or `response.text` method anymore!

zlFetch handles it for you automatically so you can go straight to using your response.

```js
zlFetch('url')
  .then(response => console.log(response))
  .catch(error => console.log(error))
```

### Shorthand methods for GET, POST, PUT, PATCH, and DELETE

zlFetch contains shorthand methods for these common REST methods so you can use them quickly.

```js
zlFetch.get(/* some-url */)
zlFetch.post(/* some-url */)
zlFetch.put(/* some-url */)
zlFetch.patch(/* some-url */)
zlFetch.delete(/* some-url */)
```

### Supported response types

zlFetch supports `json`, `text`, and `blob` response types so you don't have to write `response.json()`, `response.text()` or `response.blob()`.

Other response types are not supported right now. If you need to support other response types, consider using your own [response handler](#custom-response-handler)

### The response contains all the data you may need

zlFetch sends you all the data you need in the `response` object. This includes the following:

- `headers`: response headers
- `body`: response body
- `status`: response status
- `statusText`: response status text
- `response`: original response from Fetch

We do this so you don't have to fish out the `headers`, `status`, `statusText` or even the rest of the `response` object by yourself.

### Debugging the request

New in `v4.0.0`: You can debug the request object by adding a `debug` option. This will reveal a `debug` object that contains the request being constructed.

- `url`
- `method`
- `headers`
- `body`

```js
zlFetch('url', { debug: true })
  .then({ debug } => console.log(debug))
```

### Error Handling

zlFetch directs all 400 and 500 errors to the `catch` method. Errors contain the same information as a response.

- `headers`: response headers
- `body`: response body
- `status`: response status
- `statusText`: response status text
- `response`: original response from fetch

This makes is zlFetch super easy to use with promises.

```js
zlFetch('some-url').catch(error => {
  /* Handle error */
})

// The above request can be written in Fetch like this:
fetch('some-url')
  .then(response => {
    if (!response.ok) {
      Promise.reject(response.json)
    }
  })
  .catch(error => {
    /* Handle error */
  })
```

### Easy error handling when using `async`/`await`

zlFetch lets you pass all errors into an `errors` object. You can do this by adding a `returnError` option. This is useful when you work a lot with `async/await`.

```js
const { response, error } = await zlFetch('some-url', { returnError: true })
```

## Helpful Features

### Query string helpers

You can add `query` or `queries` as an option and zlFetch will create a query string for you automatically. Use this with `GET` requests.

```js
zlFetch('some-url', {
  queries: {
    param1: 'value1',
    param2: 'to encode',
  },
})

// The above request can be written in Fetch like this:
fetch('url?param1=value1&param2=to%20encode')
```

### `Content-Type` generation based on `body` content

zlFetch sets `Content-Type` appropriately depending on your `body` data. It supports three kinds of data:

- Object
- Query Strings
- Form Data

If you pass in an `object`, zlFetch will set `Content-Type` to `application/json`. It will also `JSON.stringify` your body so you don't have to do it yourself.

```js
zlFetch.post('some-url', {
  body: { message: 'Good game' },
})

// The above request is equivalent to this
fetch('some-url', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Good game' }),
})
```

zlFetch contains a `toObject` helper that lets you convert Form Data into an object. This makes it super easy to zlFetch with forms.

```js
import { toObject } from 'zl-fetch'
const data = new FormData(form.elements)

zlFetch('some-url', {
  body: toObject(data),
})
```

If you pass in a string, zlFetch will set `Content-Type` to `application/x-www-form-urlencoded`.

zlFetch also contains a `toQueryString` method that can help you convert objects to query strings so you can use this option easily.

```js
import { toQueryString } from 'zl-fetch'

zlFetch.post('some-url', {
  body: toQueryString({ message: 'Good game' }),
})

// The above request is equivalent to this
fetch('some-url', {
  method: 'post',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'message=Good%20game',
})
```

If you pass in a Form Data, zlFetch will let the native `fetch` function handle the `Content-Type`. Generally, this will use `multipart/form-data` with the default options. If you use this, make sure your server can receive `multipart/form-data`!

```js
import { toObject } from 'zl-fetch'
const data = new FormData(form.elements)

zlFetch('some-url', { body: data })

// The above request is equivalent to this
fetch('some-url', { body: data })

// Your server should be able to receive multipart/form-data if you do this. If you're using Express, you can a middleware like multer to make this possible:
import multer from 'multer'
const upload = multer()
app.use(upload.array())
```

**Breaking Change in `v5.0.0`**: If you pass in a `Content-Type` header, zlFetch will not set format your body content anymore. We expect you to be able to pass in the correct data type. (We had to do this to support the new API mentioned above).

### Authorization header helpers

If you provide zlFetch with an `auth` property, it will generate an Authorization Header for you.

If you pass in a `string` (commonly for tokens) , it will generate a Bearer Auth.

```js
zlFetch('some-url', { auth: 'token12345' })

// The above request can be written in Fetch like this:
fetch('some-url', {
  headers: { Authorization: `Bearer token12345` },
})
```

If you pass in an `object`, zlFetch will generate a Basic Auth for you.

```js
zlFetch('some-url', {
  auth: {
    username: 'username'
    password: '12345678'
  }
})

// The above request can be written in Fetch like this:
fetch('some-url', {
  headers: { Authorization: `Basic ${btoa('username:12345678')}` }
});
```

### Creating a zlFetch Instance

You can create an instance of `zlFetch` with predefined options. This is super helpful if you need to send requests with similar `options` or `url`.

- `url` is required
- `options` is optional

```js
import { createZLFetch } from 'zl-fetch'

// Creating the instance
const api = zlFetch(baseUrl, options)
```

All instances have shorthand methods as well.

```js
// Shorthand methods
const response = api.get(/* ... */)
const response = api.post(/* ... */)
const response = api.put(/* ... */)
const response = api.patch(/* ... */)
const response = api.delete(/* ... */)
```

New in `v5.0.0`

You can now use a `zlFetch` instance without passing a URL. This is useful if you have created an instance with the right endpoints.

```js
import { createZLFetch } from 'zl-fetch'

// Creating the instance
const api = zlFetch(baseUrl, options)
```

All instances have shorthand methods as well.

```js
// Shorthand methods
const response = api.get() // Without URL, without options
const response = api.get('some-url') // With URL, without options
const response = api.post('some-url', { body: 'message=good+game' }) // With URL, with options
const response = api.post({ body: 'message=good+game' }) // Without URL, with options
```

### Custom response handler

If you want to handle a response not supported by zlFetch, you can pass `customResponseParser: true` into the options. This returns the response from a normal Fetch request without any additional treatments from zlFetch. You can then use `response.json()` or other methods as you deem fit.

```js
const response = await zlFetch('url', {
  customResponseParser: true,
})
const data = await response.arrayBuffer()
```
