# curldoc

curldoc is a simple executable Web API document format using the curl command.

The CLI Application of curldoc behave a HTTP mock server from a markdown file of Web API document.

You can create a mock server with such as the following markdown document.

<pre>

The document is a markdown file.
You can write anything outside of ``` ... ```

And you can describe a mock server's endpoint behaviors with a pair of code-block 'curldoc-request' and 'curldoc-response'.

First, please describe accepting reqeust with curl command format in 'curldoc-request'

```curldoc-request
curl http://localhost:3000/hello --header 'Accept: application/json'
```

Next, please describe returning response body text in 'curldoc-request'
(HTTP status code is '200 OK'.)

```curldoc-response
{
    "message": "hello",
    "path": "/json_endpoint"
}
```

In addition, you can specify any HTTP response headers or HTTP status code with using a code-block 'curldoc-response-include'

```curldoc-request
curl http://localhost:3000/response-internal-server-error
```

```curldoc-response-include
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain
Transfer-Encoding: chunked

Internal Server Error....


```

</pre>

## Usage

### CLI



```sh
# Install CLI-app
$ npm install --global curldoc

# Download sample document
$ curl -sL https://raw.githubusercontent.com/yammerjp/curldoc/main/example/helloworld.md > helloworld.md

# Start mock server
$ curldoc helloworld.md

# Usage:
# $ curldoc (--port <TCP port>) <markdown file paths ... >
```

### Library

1. Install the npm package 'curldoc' with `npm i curldoc` for your project
2. Create API document ([example](./example/helloworld.md))
3. Write TypeScript/JavaScript such as the following code

```typescript
import curldoc from 'curldoc'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  const server = await curldoc.server(3000, [ 'path/to/markdown/file.md' ])

  await wait(1000)

  server.close()
  console.log('closed')
}

main()
```

## Support curl options

You can use following the options in a markdown's codeblock 'curldoc-request'.

- `--header`, `-H` ... specify http request headers
- `--data-raw` ... specify a http request body
- `--request`, `-X` ... specify a http request method

If you want to use other options, please contribute to the repository.
(curl options are processed in /src/documentProcessor/curlOptionHandlers.ts)

## LICENSE

MIT
