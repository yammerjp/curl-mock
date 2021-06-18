# curldoc

curldoc is a simple executable Web API document format using the curl command.

The CLI Application of curldoc behave a HTTP mock server from a markdown file of Web API document.


<pre>

A document is markdown file.
You can write anything outside of ``` ... ```

```curldoc-request
curl http://localhost:3000/hello3 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
```

```curldoc-response
{
    "message": "hello",
    "path": "/json_endpoint"
}
```

</pre>

## Setup

```sh
$ git clone https://github.com/yammerjp/curldoc.git
$ cd curldoc
$ npm i
$ npm run build && npm start
```
