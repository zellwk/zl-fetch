import app from './server.js'
import portastic from 'portastic'

export async function setup(ctx) {
  const ports = await portastic.find({ min: 8000, max: 8080 })

  // Get Random Port because portastic doesn't seem to detect port closure before, probably because the tests are so short.
  const port = ports[Math.floor(Math.random() * ports.length)]
  const server = app.listen(port)

  ctx.port = port
  ctx.server = server
  ctx.endpoint = `http://localhost:${port}`
}

export async function teardown({ server }) {
  server.close()
}
