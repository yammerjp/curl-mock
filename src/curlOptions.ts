import httpHeaderLineParser from './httpHeaderLineParser'
// ---------- type definitions ----------
interface CurldocRequest {
  path?: string
  header?: { [key:string]: string }
  method?: HTTPRequestMethods
  body?: HTTPRequestBody
}

type CurlOptionHandler = (nextToken?: string) => {
  request: CurldocRequest
  consumedNextToken: boolean
}

type CurlOptionHandlers = {
  [optionname:string]: CurlOptionHandler
}

// ---------- handlers ----------
const handleHttpRequestMethod: CurlOptionHandler = (nextToken) => {
  if (nextToken === undefined) {
    throw new Error('Need next token to specify HTTP request method. (ex. GET, POST, PUT, DELETE ...)')
  }
  if (nextToken !== 'GET' && nextToken !== 'POST' && nextToken !== 'PUT' && nextToken !== 'DELETE') {
    throw new Error('Unknown HTTP request method is specified')
  }
  return {
    request: {
      method: nextToken
    },
    consumedNextToken: true
  }
}

const handleHttpBodyRaw: CurlOptionHandler = (nextToken) => {
  if (nextToken === undefined) {
    throw new Error('Need next token to specify HTTP request body.')
  }
  return {
    request: {
      body: structObjectIfJson(nextToken)
    },
    consumedNextToken: true
  }
}

const handleHttpHeader: CurlOptionHandler = (nextToken) => {
  if (nextToken === undefined) {
    throw new Error('Need next token to specify a HTTP header.')
  }
  const { key, value } = httpHeaderLineParser(nextToken)
  if (!key) {
    throw new Error('Failed to parse HTTP request headr.')
  }
  return {
    request: {
      header: {
        [key]: value,
      },
    },
    consumedNextToken: true,
  };
}


// ---------- handlers object ----------
const curlOptionHandlers: CurlOptionHandlers = {
  '-X':         handleHttpRequestMethod,
  '--request':  handleHttpRequestMethod,
  '--data-raw': handleHttpBodyRaw,
  '--header':   handleHttpHeader,
  '-H':         handleHttpHeader,
}


// ---------- utility functions ----------
function structObjectIfJson(body: string | undefined): HTTPRequestBody | undefined {
    console.log(`before struct: ${body}`)
  try {
    if (body === undefined) {
      return undefined
    }
    return JSON.parse(body)
  } catch {
    return body
  }
}


export { curlOptionHandlers, structObjectIfJson }