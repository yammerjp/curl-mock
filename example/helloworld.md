# This is a example of API document for curl-mock

you can create a mock server from this markdown file.

```curlmock-host
http://localhost:3000
```

```curlmock-request
curl http://localhost:3000
```

```curlmock-response
hello, world!
```

```curlmock-request
curl http://localhost:3000/hello2
```

```curlmock-response
hello, world2!
```

```curlmock-request
curl http://localhost:3000/json_endpoint
```

```curlmock-response
{
    "message": "hello",
    "path": "/json_endpoint"
}
```

```curlmock-request
curl http://localhost:3000/hello3 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
```

```curlmock-response
hello, world3!
```

