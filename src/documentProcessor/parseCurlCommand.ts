import { split as tokenizeShellCommand } from 'shlex'
import { curlOptionHandlers } from './curlOptionHandlers'

function parseCurlCommand(curlCmdStr: string): Request {
  let path: string | undefined
  const header: { [key: string]: string } = {}
  let method: HTTPRequestMethods | undefined
  let body: HTTPRequestBody | undefined

  const tokens = tokenizeShellCommand(curlCmdStr)

  const [firstToken] = tokens
  if (firstToken !== 'curl') {
    throw new Error('request is invalid format (need "curl" on head)')
  }

  for (let i = 1; i < tokens.length; i += 1) {
    const [token, nextToken] = tokens.slice(i, i + 2)

    // path
    if (/^http(s)?:\/\//.test(token)) {
      if (path) {
        console.error({ error: 'specifying url is duplicated' })
        continue
      }
      path = parseUrl(token)
      continue
    }

    const optionHandler = curlOptionHandlers[token]
    if (!optionHandler) {
      throw new Error('Unknow option')
    }
    const handled = optionHandler(nextToken)

    // update local variables to reflect 'handled'
    if (handled.request.path !== undefined) {
      if (path) {
        throw new Error('Failed to parserequest. HTTP request methods conflict.')
      }
      path = handled.request.path
    }
    if (handled.request.header !== undefined) {
      const [key] = Object.keys(handled.request.header)
      if (header[key]) {
        throw new Error('Failed to parse request. Headers conflict.')
      }
      header[key] = handled.request.header[key]
    }
    if (handled.request.method !== undefined) {
      if (method) {
        throw new Error('Failed to parse request. Methods conflict.')
      }
      method = handled.request.method
    }
    if (handled.request.body !== undefined) {
      if (body) {
        throw new Error('Failed to parse request. HTTP request body conflict.')
      }
      body = handled.request.body
    }

    if (handled.consumedNextToken) {
      i += 1
    }
  }

  if (!path) {
    throw new Error('Failed to parse request. Url is not specified')
  }
  if (!method) {
    method = 'GET'
  }
  if (!body) {
    body = ''
  }
  return { method, path, header, body }
}

function parseUrl(token: string): string {
  const urlParts = token.split('/')
  if (urlParts.length < 4) {
    return '/'
  }
  return `/${urlParts.slice(3).join('/')}`
}

export { parseCurlCommand, parseUrl }
