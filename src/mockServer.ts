import http, { IncomingMessage, ServerResponse } from 'http'

class MockServer {
  endpoints: Endpoint[] = []

  private ports() {
    const portsArray = this.endpoints.map((e) => e.request.port).filter((p) => typeof p === 'string') as string[]
    return Array.from(new Set(portsArray))
  }

  start() {
    const ports = this.ports()
    ports.forEach((port) => {
      const endpoints = this.endpoints.filter((e) => e.request.port === port)
      createServer(endpoints).listen(port)
      console.log(
        `A server of curl-mock is running at http://localhost:${port}/\nPlease execute such as following the curl command\ncurl http://localhost:${port}`
      )
    })
  }
}

function createServer(endpoints: Endpoint[]) {
  return http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const body = await new Promise((resolve) => {
      let b = ''
      req
        .on('data', (chunk) => {
          b += chunk
        })
        .on('reqdable', () => req.read())
        .on('end', () => resolve(b))
    })

    const { url, headers, method } = req

    console.log(`request: ${JSON.stringify({ url, headers, body, method })}`)
    const endpointsPathMatched =  endpoints.filter((e) => e.request.path === req.url)
    if (endpointsPathMatched.length === 0) {
      res.writeHead(404)
      res.end('Not found', 'utf-8')
      return
    }

    const endpointsMethodMatched = endpointsPathMatched.filter(e => e.request.method === req.method)
    if (endpointsMethodMatched.length === 0) {
        res.writeHead(405)
        res.end('Method Not Allowed', 'utf-8')
        return
    }

    const endpointsHeaderMathed = endpointsMethodMatched.filter(e => Object.keys(e.request.header).every(key => e.request.header[key] === req.headers[key.toLowerCase()]))
    if (endpointsHeaderMathed.length === 0) {
      res.writeHead(400)
      res.end('Bad Request', 'utf-8')
      return
    }

    if (endpointsHeaderMathed.length > 1) {
        console.error({error: 'request matched multiple endpoints'})
    }

    const [endpoint] = endpointsHeaderMathed
    res.writeHead(endpoint.response.status, endpoint.response.header)
    res.end(endpoint.response.body, 'utf-8')
  })
}

const mockServer = new MockServer()

export default mockServer
