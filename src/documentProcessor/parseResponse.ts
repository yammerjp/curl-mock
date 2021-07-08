import parseHttpHeader from './parseHttpHeader'

function parseResponse(str: string, type: ResponseType): Response {
  if (type === 'response') {
    return {
      status: 200,
      header: { 'Content-Type': 'text/plain' },
      body: str
    }
  }
  if (type === 'response-include') {
    return parseResponseIncludeHeaders(str)
  }
  throw new Error('unknown response type')
}

function parseResponseIncludeHeaders(str: string): Response {
  const lines = str.split('\n')
  const header: { [key: string]: string } = {}
  let status = 200
  let i = 0
  for (; i < lines.length; i += 1) {
    // status code
    if (i === 0 && /^HTTP\/1\.1 [0-9][0-9][0-9] /.test(lines[i])) {
      const [, statusStr] = lines[i].split(' ')
      if (Number(statusStr) < 100 || Number(statusStr) >= 600) {
        throw new Error('Failed to parse http response status code. The first line of response is invalid' )
      }
      status = Number(statusStr)
      continue
    }

    // header finished
    if (lines[i] === '') {
      i += 1
      break
    }

    // header
    const { key, value } = parseHttpHeader(lines[i])
    if (!key) {
      throw new Error('Failed to parse http response header.')
    }
      header[key] = value
    continue
  }

  const body = i < lines.length ? lines.slice(i).join('\n') : ''

  return {
    status,
    header,
    body
  }
}

export { parseResponse, parseResponseIncludeHeaders }
