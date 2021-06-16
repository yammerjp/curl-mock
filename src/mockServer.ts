import http, { IncomingMessage, ServerResponse } from 'http'

class MockServer {
    endpoints: Endpoint[] = []

    private ports() {
        const portsArray = this.endpoints.map(e => e.request.port).filter(p => typeof p === 'string')  as string[]
        return Array.from(new Set(portsArray))
    }

    start() {
        const ports = this.ports()
        ports.forEach((port) => {
            const endpoints = this.endpoints.filter(e => e.request.port === port)
            createServer(endpoints).listen(port)
            console.log(`A server of curl-mock is running at http://localhost:${port}/\nPlease execute such as following the curl command\ncurl http://localhost:${port}`)
        })
    }
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

const mockServer = new MockServer()

export default mockServer