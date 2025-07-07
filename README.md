# zlFetch

zlFetch is a wrapper around fetch that provides you with a convenient way to make requests.

It's features are as follows:

- Quality of life improvements over the native `fetch` function

  - [Use the response right away](#quick-start) without using `response.json()`, `response.text()`, or `response.blob()`.
  - [Promise-like error handling](#error-handling) — all 400 and 500 errors are directed into the `catch` block automatically.
  - [Easy error handling when using `await`](#easy-error-handling-when-using-asyncawait) — errors can be returned so you don't have to write a `try/catch` block.
  - [Built-in abort functionality](#aborting-the-request)
  - Streaming capabilitiies with [pure Fetch](#streaming-with-fetch) and [Event Source](#streaming-with-event-source)

- Additional improvements over the native `fetch` function
  - `Content-Type` headers are set [automatically](#content-type-generation-based-on-body-content) based on the `body` content.
  - [Get everything you need](#the-response-contains-all-the-data-you-may-need) about your response — `headers`, `body`, `status`, and more.
  - [Debug your request](#debugging-the-request) without looking at the Network panel
  - Shorthand for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods
  - [Helper for generating query strings](#query-string-helpers) so you don't have to mess with query parameters.
  - [Generates authorization headers](#authorization-header-helpers) with an `auth` property.
  - [Create instances to hold url and options](#creating-a-zlfetch-instance) so you don't have to repeat yourself.

Note: zlFetch is a ESM library since `v4.0.0`.

# Table of Contents

- [zlFetch](#zlfetch)
- [Table of Contents](#table-of-contents)
  - [Installing zlFetch](#installing-zlfetch)
    - [Through npm (recommended)](#through-npm-recommended)
    - [Through browsers](#through-browsers)
  - [Quick Start](#quick-start)
    - [Shorthand methods for GET, POST, PUT, PATCH, and DELETE](#shorthand-methods-for-get-post-put-patch-and-delete)
    - [Supported response types](#supported-response-types)
    - [The response contains all the data you may need](#the-response-contains-all-the-data-you-may-need)
    - [Debugging the request](#debugging-the-request)
    - [Error Handling](#error-handling)
    - [Easy error handling when using `async`/`await`](#easy-error-handling-when-using-asyncawait)
  - [Streaming with Fetch](#streaming-with-fetch)
    - [Server-Sent Events (SSE)](#server-sent-events-sse)
    - [`Transfer-Encoding: chunked`](#transfer-encoding-chunked)
    - [Other Streams](#other-streams)
  - [Aborting the request](#aborting-the-request)
    - [Basic Usage](#basic-usage)
    - [With async/await](#with-asyncawait)
    - [Passing in abort controller manually](#passing-in-abort-controller-manually)
  - [Helpful Features](#helpful-features)
    - [Query string helpers](#query-string-helpers)
    - [`Content-Type` generation based on `body` content](#content-type-generation-based-on-body-content)
    - [Authorization header helpers](#authorization-header-helpers)
    - [Creating a zlFetch Instance](#creating-a-zlfetch-instance)
    - [Custom response handler](#custom-response-handler)
  - [Streaming with event source](#streaming-with-event-source)
    - [Listen to any event](#listen-to-any-event)
    - [Using the Fetch Version](#using-the-fetch-version)
      - [Setting Retry Interval](#setting-retry-interval)
    - [Closing an event source](#closing-an-event-source)

## Installing zlFetch

### Through npm (recommended)

```bash
# Installing through npm
npm install zl-fetch --save
```

Then you can use it by importing it in your JavaScript file.

```js
import zlFetch from 'zl-fetch'
```

### Through browsers

You can import zlFetch directly into JavaScript through a CDN.

To do this, you first need to set your `script`'s type to `module`, then import `zlFetch`.

```html
<script type="module">
  import zlFetch from 'https://cdn.jsdelivr.net/npm/zl-fetch@6.0.0/src/index.js'
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

It also supports streams. See [streaming](##streaming) for a better understanding of how this works.

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
const { response, error } = await zlFetch('some-url', {
  returnError: true,
})
```

## Streaming with Fetch

zlFetch supports streaming in `v6.2.0`. It detects streams when you pass in `stream: true` as an option. It also provides a readable stream helper to decode the stream.

The following can be detected as streams:

- `Content-Type` header is `text/event-stream`
- Header contains `Transfer-Encoding: chunked`
- There is no `Content-Length` header

The decoded stream is stored inside `response.body` so you can simply loop through it to get your chunks. Below are a few caveats you need to know because the implementation changes _slightly_ due depending on how servers implement streaming.

### Server-Sent Events (SSE)

zlFetch decodes the request body for you automatically for server-sent events. Just loop through the `request.body` to get your chunks.

```js
const response = await zlFetch('/sse-endpoint', { stream: true })

for await (const chunk of response.body) {
  // Do something with chunk
  chunks.push(chunk)
}
```

The pure `zlFetch` function might not be the best at handling SSE because it doesn't reconnect automatically when the connection is lost. See [Streaming with Event Source](#streaming-with-event-source) for a recommended approach.

### `Transfer-Encoding: chunked`

The `Transfer-Encoding` header does not reach the browser the stream will not be decoded automatically. To decode it in the browser, use the `readStream` helper we provided. No need for this extra step if you're sending the Fetch request from a server.

```js
import { readStream } from 'zl-fetch'

const response = await zlFetch('/sse-endpoint', { stream: true })

// For Browsers
const stream = readStream(response.body)
for await (const chunk of stream) {
  /* ...*/
}

// For Servers
for await (const chunk of response.body) {
  /* ... */
}
```

### Other Streams

zlFetch detects it's a stream if there is no `Content-Length` header. For these streams, the `Transfer-Encoding: chunked` rules above apply.

<!--
### Progress Tracking

You can track download progress by monitoring the stream:

```js
const response = await zlFetch('large-file')
const contentLength = response.headers.get('content-length')
let receivedLength = 0

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  receivedLength += value.length
  const progress = (receivedLength / contentLength) * 100
  console.log(`Download progress: ${progress.toFixed(2)}%`)
}
``` -->

## Aborting the request

You can abort a request — both normal and streams — using the same `abort()` method. This is useful for:

- Canceling long-running requests
- Stopping requests when a user navigates away
- Implementing request timeouts
- Canceling requests when new data is needed

### Basic Usage

```js
// With promises
const request = zlFetch('endpoint')

// Aborts the request
request.abort()

// Handle the abort
request.catch(error => {
  if (error.name === 'AbortError') {
    console.log('Request was aborted')
  }
})
```

We've added the `abort` function to the `.then` call so you can call it while handling the response.

```js
// With promises
const request = zlFetch('endpoint')
  .then(response => {
    // Aborts the request
    response.abort()
  })
  .catch(error => {
    // Handle the abort error
    if (error.name === 'AbortError') {
      console.log('Request was aborted')
    }
  })
```

### With async/await

You can also handle aborts when using async/await:

```js
try {
  const response = await zlFetch('endpoint')
  // Aborts the request
  response.abort()
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was aborted')
  }
}
```

### Passing in abort controller manually

If you wish to, you can pass in your abort controller as well. No need to pass the abort `signal` — we'll create a signal from that controller for the abort method.

```js
const customAbortController = new AbortController()
const response = await zlFetch('endpoint', {
  controller: customAbortController,
})

// Abort the request
response.abort()
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

## Streaming with event source

We created a small wrapper around [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) for streaming with SSE.

On the browser, we use the Browser's Event Source — with a few addons — as the default. On the server, we wrap zlFetch with a retry functionality to make it similar to the Browser version.

```js
import { zlEventSource } from 'zl-fetch'
const source = zlEventSource(url, options)
```

### Listen to any event

zlEventSource lets you listen to any events by providing the event as a callback in `options`. Custom events are also supported. This provides a simpler API for usage.

```js
import { zlEventSource } from 'zl-fetch'
const source = zlEventSource(url, {
  open: data => console.log(data),
  message: data => console.log(data),
  ping: data => console.log(data), // This is a custom event
  close: data => console.log(data),
})
```

### Using the Fetch Version

The browser's event source capabilities are quite limited — you can only send a `GET` request. If you want to be able to send `POST` requests, add `Authorization`, the best method is to use the wrapped zlFetch version.

To use this, just set `useFetch` to true.

On servers, we automatically use the wrapped zlFetch version.

```js
import { zlEventSource } from 'zl-fetch'
const source = zlEventSource(url, { useFetch: true }, fetchOptions)
```

You can continue monitoring for events with the event callbacks.

```js
import { zlEventSource } from 'zl-fetch'
const source = zlEventSource(
  url,
  {
    useFetch: true,
    message: data => console.log(data),
  },
  fetchOptions,
)
```

#### Setting Retry Interval

Retry intervals will be set according to the `retry` property sent in the SSE response. If it's not present, you can adjust the retry interval with the `retry` property.

```js
import { zlEventSource } from 'zl-fetch'
const source = zlEventSource(
  url,
  {
    useFetch: true,
    retry: 3000, // In milliseconds
  },
  fetchOptions,
)
```

### Closing an event source

`zlEventSource` will close automatically if the server sents a `close` event. If you wish to terminate the session earlier, you can call the `close` method on the event source.

```js
const source = zlEventSource(url)
source.close() // Terminates the event source connection
```
