#!/usr/bin/env node

const http = require('http');

const inputRequest = 'curl http://localhost:3000'
const inputResponse = 'hello, world!'

function requestParser(curlCmdStr) {
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
  if (pathParts === undefined || pathParts === '' || pathParts.length === 0) {
    path = '/'
  } else {
    path = '/' + pathPaths.join('/')
  }
  return { port, path }
}

function createServer(path, response) {
    return http.createServer((req, res) => {
      if (req.url !== path) {
        res.writeHead(404)
        res.end('Not found', 'utf-8')
        return
      }

      res.writeHead(response.status, response.header)
      res.end(response.body, 'utf-8')
    })
}

const request = requestParser(inputRequest);

if (request.error) {
  console.error(reqeust.error)
  process.exit(1)
}

const server = createServer(request.path, {
  status: 200,
  header: { 'Content-Type': 'text/plain' },
  body: inputResponse
})

server.listen(request.port);
console.log(`A server of curl-mock is running at http://localhost:${request.port}/`);
console.log(`Please execute such as following the curl command\n`)
console.log(`curl http://localhost:${request.port}`)
