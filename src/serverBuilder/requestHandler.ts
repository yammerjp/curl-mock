import { IncomingMessage, ServerResponse } from 'http'
import structObjectIfJson from '../utils/structObjectIfJson'
import deepInclude from '../utils/deepInclude'

function createRequestHandler(endpoints: Endpoint[]): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const bodyRaw = await new Promise((resolve) => {
      let b = ''
      req.on('data', (chunk) => {
        b += String(chunk)
      })
      req.on('end', () => resolve(b))
    })
    const body = structObjectIfJson(bodyRaw as string)

    const endpointsPathMatched = endpoints.filter((e) => e.request.path === req.url)
    if (endpointsPathMatched.length === 0) {
      res.writeHead(404).end('Not found', 'utf-8')
      return
    }

    const endpointsMethodMatched = endpointsPathMatched.filter((e) => e.request.method === req.method)
    if (endpointsMethodMatched.length === 0) {
      res.writeHead(405).end('Method Not Allowed', 'utf-8')
      return
    }

    const endpointsHeaderMathed = endpointsMethodMatched.filter((e) =>
      Object.keys(e.request.header).every((key) => e.request.header[key] === req.headers[key.toLowerCase()])
    )
    if (endpointsHeaderMathed.length === 0) {
      res.writeHead(400).end('Bad Request (header)', 'utf-8')
      return
    }

    const endpointsBodyMatched = endpointsHeaderMathed.filter((e) => deepInclude(body, e.request.body))
    if (endpointsBodyMatched.length === 0) {
      res.writeHead(400).end('Bad Request (body)', 'utf-8')
      return
    }

    if (endpointsBodyMatched.length > 1) {
      console.error({ error: 'request matched multiple endpoints' })
    }

    const [{ response }] = endpointsBodyMatched
    res.writeHead(response.status, response.header).end(response.body, 'utf-8')
  }
}

export default createRequestHandler
