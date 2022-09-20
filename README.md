# zlFetch

zlFetch is a wrapper around fetch that provides you with a convenient way to may requests.

It's features are as follows:

- You can [use the response right away](#quick-start) without calling an extra `.then`, or `response.json()`, or `response.text()`
- It [returns everything you need](#contains-all-data-about-the-response) to know about a response in one object — headers, body, status... everything!
- You can [debug your request](#debugging-the-request) — and see what url, headers, and body you send — without looking into the Network panel... this saves so much time debugging requests!
- There are shorthand methods GET, POST, PUT, PATCH, and DELETE methods, meaning faster access to the most common HTTP methods.
- This package [generates query strings for you automatically](#automatic-generation-of-query-strings) so you don't have to worry about URLSearchParam stuff. Just pass in an object!
- The [`Content-Type` is set to `application/json` for you automatically](#automatic-content-type-generation-and-body-formatting) if you use a POST, PUT, PATCH, request — no need to write `application/json` yourself which saves lots of time (and wrist power)!
- You always [override the `Content-Type` header](#automatic-content-type-generation-and-body-formatting) if you need to!
- [Your body data is gets formatted a JSON or form data for you automatically](#automatic-content-type-generation-and-body-formatting) when Content Type is `application/json` or `application/x-www-form-urlencoded`.
- [No need to write Authorization Headers yourself](#automatic-authorization-header-generation) — zlFetch takes care of both Basic and Bearer Authorization Headres as long as you pass in an `auth` property.
- [Easier error handling](#error-handling) when you use promises — all 400 and 500 errors are automatically directed to the `catch` block which is aligned with how promises work!
- You can also choose to [return errors as an error object](#error-handling) in the `then` block — this is super useful in a Node context when you want to check for errors before doing something else!

<!-- no toc -->
- [zlFetch](#zlfetch)
  - [Installing zlFetch](#installing-zlfetch)
  - [Quick Start](#quick-start)
    - [Contains all data about the response](#contains-all-data-about-the-response)
    - [Debugging the request](#debugging-the-request)
    - [Shorthand methods for GET, POST, PUT, PATCH, and DELETE](#shorthand-methods-for-get-post-put-patch-and-delete)
  - [Features that help you write less code](#features-that-help-you-write-less-code)
    - [Automatic Generation of Query Strings](#automatic-generation-of-query-strings)
    - [Automatic Content-Type Generation and Body Formatting](#automatic-content-type-generation-and-body-formatting)
    - [Automatic Authorization Header Generation](#automatic-authorization-header-generation)
  - [Error Handling](#error-handling)
  - [Handling other Response Types](#handling-other-response-types)

Note: From `v4.0.0` onwards, zlFetch is a ESM library. It cannot be used with CommonJS anymore.

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
  import zlFetch from 'https://www.jsdelivr.com/package/npm/zl-fetch'
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

### Contains all data about the response

zlFetch sends you all the data you need in the `response` object. This includes the following:

- `headers`: response headers
- `body`: response body
- `status`: response status
- `statusText`: response status text
- `response`: original response from Fetch

### Debugging the request

New in `v4.0.0`: You can debug the request object by adding a `debug` option. This will reveal a `debug` object that contains the request being constructed.

- url
- method
- headers
- body

```js
zlFetch('url', { debug: true })
  .then({ debug } => console.log(debug))
```

Note: The `logRequestOptions` option is replaced by the `debug` object in `v4.0.0`. The `logRequestOptions` option is no longer available.

### Shorthand methods for GET, POST, PUT, PATCH, and DELETE

zlFetch contains shorthand methods for these common REST methods so you can use them quickly.

```js
zlFetch.get(/* some-url */)
zlFetch.post(/* some-url */)
zlFetch.put(/* some-url */)
zlFetch.patch(/* some-url */)
zlFetch.delete(/* some-url */)
```

## Features that help you write less code

### Automatic Generation of Query Strings

You can add `query` or `queries` as an option and zlFetch will create a query string for you automatically.:

```js
zlFetch('some-url', {
  queries: {
    param1: 'value1',
    param2: 'to encode'
  }
})

// The above request can be written in Fetch like this:
fetch('url?param1=value1&param2=to%20encode')
```

### Automatic Content-Type Generation and Body Formatting

zlFetch sets `Content-Type` to `application/json` for you automatically if your `method` is `POST`, `PUT`, or `PATCH`.

It will also help you `JSON.stringify` your body so you don't have to do it yourself.

```js
zlFetch.post('some-url', {
  body: { message: 'Good game' }
})

// The request above can be written in Fetch like this:
fetch('some-url', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Good game' })
})
```

You can manually set your `Content-Type` to other values and zlFetch will honour the value you set.

If you set `Content-Type` to `application/x-www-form-urlencoded`, zlFetch will automatically format your body to `x-www-form-urlencoded` for you.

```js
zlFetch.post('some-url', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: { message: 'Good game' }
})

// The request above can be written in Fetch like this:
fetch('some-url', {
  method: 'post',
  body: 'message=Good+game'
})
```

### Automatic Authorization Header Generation

If you provide zlFetch with an `auth` property, it will generate an Authorization Header for you.

If you pass in a `string` (commonly for tokens) , it will generate a Bearer Auth.

```js
zlFetch('some-url', { auth: 'token12345' })

// The above request can be written in Fetch like this:
fetch('some-url', {
  headers: { Authorization: `Bearer token12345` }
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

## Error Handling

zlFetch directs all 400 and 500 errors to the `catch` method. Errors contain the same information as a response.

- `headers`: response headers
- `body`: response body
- `status`: response status
- `statusText`: response status text
- `response`: original response from fetch

This makes is zlFetch super easy to use with promises.

```js
zlFetch('some-url')
  .catch(error => { /* Handle error */})

// The above request can be written in Fetch like this:
fetch('some-url')
  .then(response => {
    if (!response.ok) {
      Promise.reject(response.json)
    }
  })
  .catch(error => { /* Handle error */})
```

zlFetch also gives you the option to pass all errors into an `errors` object instead of handling them in `catch`. This option is very much preferred when you don't your errors to be passed into a catch method. (Very useful when used in servers).

```js
const {response, error} = await zlFetch('some-url')
```

`zlFetch` changes the response and error objects. In zlFetch, `response` and `error` objects both include these five properties:

1. `headers`: response headers
2. `body`: response body
3. `status`: response status
4. `statusText`: response status text
5. `response`: original response from fetch

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

## Handling other Response Types

zlFetch only supports `json`,`blob`, and `text` response types at this point. (PRs welcome if you want to help zlFetch handle more response types!).

If you want to handle a response not supported by zlFetch, you can pass `customResponseParser: true` into the options. This returns the response from a normal Fetch request without any additional treatments from zlFetch. You can then use `response.json()` or other methods as you deem fit.

```js
const response = await zlFetch('url', {
  customResponseParser: true
})
const data = await response.arrayBuffer()
```
