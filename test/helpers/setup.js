import portastic from 'portastic'
import app from './server.js'

export async function setup (ctx) {
  const ports = await portastic.find({ min: 8000, max: 8080 })
  const port = ports[0]
  ctx.port = port
  ctx.server = app.listen(port)
  ctx.endpoint = `http://localhost:${port}`
}

export async function teardown ({ server }) {
  server.close()
}
