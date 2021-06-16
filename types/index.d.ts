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

type Block = {
    type: 'host' | 'request' | 'response'
    value: string
}

