# This is a example of API document for curl-mock

you can create a mock server from this markdown file.

```curldoc-request
curl http://localhost:3000
```

```curldoc-response
hello, world!
```

```curldoc-request
curl http://localhost:3000/hello2
```

```curldoc-response
hello, world2!
```

```curldoc-request
curl http://localhost:3000/hello2 -X POST
```

```curldoc-response
hello, world2! (POST request)
```


```curldoc-request
curl http://localhost:3000/json_endpoint
```

```curldoc-response
{
    "message": "hello",
    "path": "/json_endpoint"
}
```

```curldoc-request
curl http://localhost:3000/hello3 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
```

```curldoc-response
hello, world3!
```

