import { headerParser } from './requestParser'

export default function responseParser(str: string, type: ResponseType): Response | undefined {
  if (type === 'response') {
    return {
      status: 200,
      header: { 'Content-Type': 'text/plain' },
      body: str
    }
  }
  if (type === 'response-include') {
    return responseIncludeHeadersParser(str)
  }
  console.error({ error: 'unknown response type', value: type })
  return undefined
}

function responseIncludeHeadersParser(str: string): Response {
  const lines = str.split('\n')
  const header: { [key: string]: string } = {}
  let status = 200
  let i = 0
  for (; i < lines.length; i += 1) {
    console.log(`line: ${lines[i]}`)
    // status code
    if (i === 0 && /^HTTP\/1\.1 [0-9][0-9][0-9] /.test(lines[i])) {
      const [, statusStr] = lines[i].split(' ')
      console.log(`statusStr: ${statusStr}`)
      if (Number(statusStr) >= 100 && Number(statusStr) < 600) {
        status = Number(statusStr)
      } else {
        console.error({ error: 'Failed to parse http response status code. The first line of response is invalid' })
      }
      continue
    }

    // header finished
    if (lines[i] === '') {
      i += 1
      break
    }

    // header
    const { key, value } = headerParser(lines[i])
    if (key) {
      header[key] = value
    } else {
      console.error({ error: 'Failed to parse http response header.' })
    }
    continue
  }

  const body = i < lines.length ? lines.slice(i).join('\n') : ''

  return {
    status,
    header,
    body
  }
}
