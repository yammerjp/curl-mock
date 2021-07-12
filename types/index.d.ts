type HTTPRequestMethods = 'POST' | 'GET' | 'PUT' | 'DELETE' // ...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HTTPRequestBody = any|string

type Request = {
    method: HTTPRequestMethods
    path: string
    header: { [key:string]: string }
    body?: HTTPRequestBody
}

type ResponseType = 'response' | 'response-include'
type Response = {
  status: number
  header: { [key:string]: string }
  body: string
}

type Endpoint = {
    request: Request
    response: Response
}
