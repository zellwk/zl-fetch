import { once } from 'node:events'
import app from './server.js'

export async function setup(ctx) {
  // Port 0 lets the OS hand out a free port. Picking one ourselves collided across the spec files, which run in parallel.
  const server = app.listen(0)
  await once(server, 'listening')

  const { port } = server.address()

  ctx.port = port
  ctx.server = server
  ctx.endpoint = `http://localhost:${port}`
}

export async function teardown({ server }) {
  server.close()
  await once(server, 'close')
}
