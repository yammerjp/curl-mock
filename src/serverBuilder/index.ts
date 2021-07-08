import http from 'http'
import createRequestHandler from './requestHandler'

function serverBuilder(endpoints: Endpoint[], port: number): void {
  const processor = createRequestHandler(endpoints)
  http.createServer(processor).listen(port)
  console.log(
    `A server of curl-mock is running at http://localhost:${port}/\nPlease execute such as following the curl command\ncurl http://localhost:${port}`
  )
}

export default serverBuilder
