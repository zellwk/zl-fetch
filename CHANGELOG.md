# Changelog

Releases before `6.3.2` are in the [git log](https://github.com/zellwk/zl-fetch/commits/master).

## 6.3.3

### Fixed

- `readStream` takes `response.body`, which is what the readme has always documented. It used to take the `Response` itself, so the documented call threw. Passing a `Response` no longer works.
- Chunked streams buffer on newlines. A JSON object split across two reads used to fail `JSON.parse` and arrive as raw text.
- A final line with no trailing newline is no longer dropped.

## 6.3.2

### Fixed

- The shipped `event-source.d.ts` had a property with no name, which is a syntax error. `skipLibCheck` cannot suppress it, so it stopped TypeScript from checking a consumer's whole program.
