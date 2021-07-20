import http from 'http'
import createRequestHandler from './requestHandler'
import type { Endpoint } from '../endpoint'

function serverBuilder(endpoints: Endpoint[], port: number): http.Server  {
  const processor = createRequestHandler(endpoints)
  const server = http.createServer(processor).listen(port)
  console.log(
    `A server of curl-mock is running at http://localhost:${port}/\nPlease execute such as following the curl command\ncurl http://localhost:${port}`
  )
  return server
}

export default serverBuilder
