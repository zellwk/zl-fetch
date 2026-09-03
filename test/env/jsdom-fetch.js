import { builtinEnvironments } from 'vitest/environments'

// jsdom installs its own AbortController over Node's. Node's fetch — what these tests actually run against — checks the signal against Node's AbortSignal class and rejects jsdom's. A real browser never hits this because its fetch and its AbortController share a realm. So the mismatch belongs to the environment, and zlFetch keeps calling plain `new AbortController()`.

export default {
  name: 'jsdom-fetch',
  transformMode: 'web',

  async setup(global, options) {
    // Reads Node's originals before jsdom overwrites them
    const nodeAbort = {
      AbortController: global.AbortController,
      AbortSignal: global.AbortSignal,
    }

    const jsdom = await builtinEnvironments.jsdom.setup(global, options)
    Object.assign(global, nodeAbort)

    return {
      teardown(global) {
        return jsdom.teardown(global)
      },
    }
  },
}
