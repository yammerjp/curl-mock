function requestParser(curlCmdStr: string): Request {
  const tokens = curlCmdStr.split(' ')
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    return { error: 'request is invalid format (need "curl" on head)' }
  }
  const url = tokens.find(t => /^http:\/\/localhost(:\d+)?/.test(t))
  if (url === undefined) {
    return { error: 'request is invalid format (need url' }
  }
  const pathParts = url.split('/').slice(3)
  let path = ''
  if (pathParts === undefined || pathParts.length === 0) {
    path = '/'
  } else {
    path = '/' + pathParts.join('/')
  }
  return { path }
}

export default function createEndpointFromBlocks(blocks: Block[]): Endpoint[] {
    let port = '3000'
    let responseHeaders =  { 'Content-Type': 'text/plain' }
    let responseStatus = 200

    let requestString: string|undefined
    let responseString: string|undefined

    const endpoints: Endpoint[] = []

    blocks.forEach(b => {
        if (b.type === 'host') {
            const hostAndPort = b.value.split('/')[2]
            if (hostAndPort.includes(':')) {
                port = hostAndPort.split(':')[1]
            }
            return
        }
        if (b.type === 'request') {
            if (requestString) {
                throw new Error('request is duplicated')
            }
            requestString = b.value
        }
        if (b.type === 'response') {
            if (!requestString) {
                throw new Error('request is not defined')
            }
            responseString = b.value
            const endpoint = createEndpoint(requestString, responseString, port, responseStatus, responseHeaders)
            if (endpoint) { endpoints.push(endpoint) } else {
                throw new Error('creating endpoint is failed')
            }
            requestString = undefined
            responseString = undefined
        }
    })
    return endpoints
}

function createEndpoint(requestStr: string, responseStr: string, port: string, responseStatus: number, responseHeaders: { [key: string]: string}): Endpoint | undefined {
    const { path, error } = requestParser(requestStr)
    if (error) {
        return undefined
    }
    
    const request = { path, port }
    const response = {
        status: responseStatus,
        header: responseHeaders,
        body: responseStr
    }
    return { request, response }
}