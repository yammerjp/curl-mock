import http, { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'

const inputRequest = 'curl http://localhost:3000'
const inputResponse = 'hello, world!'

type Request = {
    error?: string
    port?: string
    path?: string
}

type Response = {
  status: number
  header: { [key:string]: string }
  body: string
}

type Endpoint = {
    request: Request
    response: Response
}

class MockServer {
    endpoints: Endpoint[] = []

    add(endpoint: Endpoint) {
        this.endpoints.push(endpoint)
    }

    private ports() {
        const portsArray = this.endpoints.map(e => e.request.port).filter(p => typeof p === 'string')  as string[]
        return Array.from(new Set(portsArray))
    }

    start() {
        const ports = this.ports()
        ports.forEach((port) => {
            const endpoints = this.endpoints.filter(e => e.request.port === port)
            createServer(endpoints).listen(port)
            console.log(`A server of curl-mock is running at http://localhost:${request.port}/\nPlease execute such as following the curl command\ncurl http://localhost:${request.port}`)
        })
    }
}


function requestParser(curlCmdStr: string): Request {
  const tokens = curlCmdStr.split(' ')
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    return { error: 'request is invalid format (need "curl" on head)' }
  }
  const url = tokens.find(t => /^http:\/\/localhost(:\d+)?/.test(t))
  if (url === undefined) {
    return { error: 'request is invalid format (need url' }
  }
  const port = url.split(':')[2] || '80'
  const pathParts = url.split('/').slice(3)
  let path
  if (pathParts === undefined || pathParts.length === 0) {
    path = '/'
  } else {
    path = '/' + pathParts.join('/')
  }
  return { port, path }
}

function createServer(endpoints: Endpoint[]) {
    return http.createServer((req: IncomingMessage, res: ServerResponse) => {
        const endpoint = endpoints.find(e => e.request.path === req.url)
        if (!endpoint) {
            res.writeHead(404)
            res.end('Not found', 'utf-8')
            return
        }
        res.writeHead(endpoint.response.status, endpoint.response.header)
        res.end(endpoint.response.body, 'utf-8')
    })
}

const request = requestParser(inputRequest);

if (request.error) {
  console.error(request.error)
  process.exit(1)
} else if (!request.path) {
  console.error('request.path is undefined...')
  process.exit(1)
}

const response = {
  status: 200,
  header: { 'Content-Type': 'text/plain' },
  body: inputResponse,
}

const mockServer = new MockServer()
mockServer.add({request, response})
mockServer.start()
// createServer([{request, response}]).listen('3000')