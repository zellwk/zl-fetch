import { describe, expect, it } from 'vitest'

import { readStream } from '../src/index.js'

// Builds a ReadableStream that emits each string as one read
function streamOf(...writes) {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      for (const write of writes) controller.enqueue(encoder.encode(write))
      controller.close()
    },
  })
}

async function collect(stream) {
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return chunks
}

describe('readStream', _ => {
  it('Takes response.body, the way the readme documents it', async () => {
    const response = new Response(streamOf('{"a":1}\n'))
    const chunks = await collect(readStream(response.body))

    expect(chunks).toEqual([{ a: 1 }])
  })

  it('Parses one JSON object per line', async () => {
    const stream = streamOf('{"a":1}\n{"a":2}\n{"a":3}\n')
    const chunks = await collect(readStream(stream))

    expect(chunks).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  })

  it('Joins an object split across two reads', async () => {
    const stream = streamOf('{"greet":"he', 'llo"}\n')
    const chunks = await collect(readStream(stream))

    expect(chunks).toEqual([{ greet: 'hello' }])
  })

  it('Emits a last line that has no trailing newline', async () => {
    const stream = streamOf('{"a":1}\n{"a":2}')
    const chunks = await collect(readStream(stream))

    expect(chunks).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('Passes a non-JSON line through as text', async () => {
    const stream = streamOf('Chunk 1\nChunk 2\n')
    const chunks = await collect(readStream(stream))

    expect(chunks).toEqual(['Chunk 1', 'Chunk 2'])
  })

  it('Skips blank lines', async () => {
    const stream = streamOf('{"a":1}\n\n\n{"a":2}\n')
    const chunks = await collect(readStream(stream))

    expect(chunks).toEqual([{ a: 1 }, { a: 2 }])
  })
})
