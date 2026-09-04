# Changelog

Releases before `6.3.2` are in the [git log](https://github.com/zellwk/zl-fetch/commits/master).

## 6.3.5

### Fixed

- A request's return type is the shape it actually resolves to — `body`, `headers`, `response`, `status`, `statusText`, `abort`, and `debug` when the `debug` option is set. It used to be `Promise<object>`, so `const { body } = await zlFetch(url)` typed `body` as a property that doesn't exist.
- `abort()` is typed on the promise as well as on the resolved response. Both have carried it since 6.0.
- `returnError: true` resolves to `{ response, error }`. The types described `error` as a field on the normal response object, which it has never been.
- `customResponseParser: true` resolves to the raw `Response`.
- `get`, `post`, `put`, `patch` and `delete` take the same options as the base call. Each declared `auth` as a string, `body` as an object, and `debug`, `returnError` and `customResponseParser` as strings — narrower than what they pass straight through to the base call.
- `get`, `post`, `put`, `patch` and `delete` declare a return type. They were `Promise<any>`.
- An instance from `createZlFetch` types its own call and its five methods. They were untyped, because TypeScript can't see methods assigned in a loop.
- The options type covers `stream`, `controller` and `signal`, and leaves room for the native Fetch options that pass through untouched.

## 6.3.4

### Added

- NDJSON. `application/x-ndjson`, `application/ndjson` and `application/jsonl` come back as an array of parsed lines, or as a stream of them with `stream: true`.

### Fixed

- SSE is detected when the content type carries a charset. `text/event-stream; charset=utf-8` was matched exactly against `text/event-stream`, so it fell through and you got raw `data:` lines instead of parsed events.
- An unrecognised content type comes back as a `Blob` instead of throwing. `image/png` and `application/pdf` used to throw `zlFetch does not support content-type`.
- `204 No Content` gives a `null` body. It used to throw `response[options.type] is not a function` — the guard returned `null` and the parser then called `response[null]()`.
- `src/util.js` imported `./handleResponse` without its extension, so Node couldn't load `zl-fetch/src` directly. Bundled builds were unaffected.
- Dropped a dead branch matching `blob` against the content type. No content type is ever the string `blob`.

## 6.3.3

### Fixed

- `readStream` takes `response.body`, which is what the readme has always documented. It used to take the `Response` itself, so the documented call threw. Passing a `Response` no longer works.
- Chunked streams buffer on newlines. A JSON object split across two reads used to fail `JSON.parse` and arrive as raw text.
- A final line with no trailing newline is no longer dropped.

## 6.3.2

### Fixed

- The shipped `event-source.d.ts` had a property with no name, which is a syntax error. `skipLibCheck` cannot suppress it, so it stopped TypeScript from checking a consumer's whole program.
