#!/usr/bin/env node

const http = require('http');

const server = http.createServer((request, response) => {
  console.log(`request ${request.url}`);

  const status = 200;
  const header = {
    'Content-Type': 'text/plain'
  };
  const resBody = 'hello, world!';
  response.writeHead(status, header);
  response.end(resBody, 'utf-8');
})

const port = 3333
server.listen(port);
console.log(`A server of curl-mock is running at http://localhost:${port}/`);
