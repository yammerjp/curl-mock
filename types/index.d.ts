type HTTPRequestMethods = 'POST' | 'GET' | 'PUT' | 'DELETE' // ...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HTTPRequestBody = any|string

type Request = {
    method: HTTPRequestMethods
    path: string
    header: { [key:string]: string }
    body?: HTTPRequestBody
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
    type: 'request' | ResponseType
    value: string
}

type ResponseType = 'response' | 'response-include'

type JsonValue = string | number | null | boolean | JsonValueArray | JsonValueObject

type JsonValueArray = Array<JsonValue>

interface JsonValueObject {
    [key: string]: JsonValue
}