import http, { IncomingMessage, ServerResponse } from 'http'
import { compactIfJson } from './requestParser'

function mockServer(endpoints: Endpoint[], port: number): void {
  const processor = createRequestProcessor(endpoints)
  http.createServer(processor).listen(port)
  console.log(
    `A server of curl-mock is running at http://localhost:${port}/\nPlease execute such as following the curl command\ncurl http://localhost:${port}`
  )
}

function createRequestProcessor(endpoints: Endpoint[]): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const bodyRaw = await new Promise((resolve) => {
      let b = ''
      req.on('data', (chunk) => {
        b += String(chunk)
      })
      req.on('end', () => resolve(b))
    })
    const body = bodyRaw ? compactIfJson(bodyRaw as string) : undefined

    const endpointsPathMatched = endpoints.filter((e) => e.request.path === req.url)
    if (endpointsPathMatched.length === 0) {
      res.writeHead(404)
      res.end('Not found', 'utf-8')
      return
    }

    const endpointsMethodMatched = endpointsPathMatched.filter((e) => e.request.method === req.method)
    if (endpointsMethodMatched.length === 0) {
      res.writeHead(405)
      res.end('Method Not Allowed', 'utf-8')
      return
    }

    const endpointsHeaderMathed = endpointsMethodMatched.filter((e) =>
      Object.keys(e.request.header).every((key) => e.request.header[key] === req.headers[key.toLowerCase()])
    )
    if (endpointsHeaderMathed.length === 0) {
      res.writeHead(400)
      res.end('Bad Request (header)', 'utf-8')
      return
    }

    const endpointsBodyMatched = endpointsHeaderMathed.filter((e) => e.request.body === body)
    if (endpointsBodyMatched.length === 0) {
      res.writeHead(400)
      res.end('Bad Request (body)', 'utf-8')
      return
    }

    if (endpointsBodyMatched.length > 1) {
      console.error({ error: 'request matched multiple endpoints' })
    }

    const [endpoint] = endpointsBodyMatched
    res.writeHead(endpoint.response.status, endpoint.response.header)
    res.end(endpoint.response.body, 'utf-8')
  }
}

export { mockServer, createRequestProcessor }
