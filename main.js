import { zlEventSource } from './dist/index.js'

const source = zlEventSource('http://localhost:3000/stream-sse', {
  status(data) {
    console.log('status', data)
  },
  message(data) {
    console.log('message',data)
  },
  error(error) {
    console.log(error)
  },
  close(event) {
    console.log(event)
  }
})
