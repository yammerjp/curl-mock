function requestParser(curlCmdStr: string): Request | undefined {
  let path: string | undefined
  const header: { [key: string]: string } = {}
  let method: HTTPRequestMethods | undefined
  let body: string | undefined

  const tokens = tokenizer(curlCmdStr)
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    console.error({ error: 'request is invalid format (need "curl" on head)' })
    return undefined
  }
  for (let i = 0; i < tokens.length; i += 1) {
    // path
    if (/^http(s)?:\/\//.test(tokens[i])) {
      if (path) {
        console.error({ error: 'specifying url is duplicated' })
        continue
      }
      path = urlParser(tokens[i])
      continue
    }

    // method
    if (tokens[i] === '-X' || tokens[i] === '--request') {
      i += 1
      if (i === tokens.length) {
        console.error({
          error: 'Failed to parse request. last token is HTTP request method option but it is not specified anything'
        })
        break
      }
      if (method) {
        console.error('Failed to parserequest. HTTP request methods conflict.')
        continue
      }
      if (tokens[i] === 'GET' || tokens[i] === 'POST' || tokens[i] === 'PUT' || tokens[i] === 'DELETE') {
        method = tokens[i] as HTTPRequestMethods
      }
    }

    // header
    if (tokens[i] === '--header' || tokens[i] === '-H') {
      i += 1
      if (i === tokens.length) {
        console.error({
          error: 'Failed to parse request. last token is HTTP header option but it is not specified anything'
        })
        break
      }
      const { key, value } = headerParser(tokens[i])
      if (!key || header[key]) {
        console.error('Failed to parserequest. Headers conflict.')
        continue
      }
      header[key] = value
    }

    // body
    if (tokens[i] === '--data-raw') {
      i += 1
      if (i === tokens.length) {
        console.error({
          error: 'Failed to parse request. last token is HTTP request body option but it is not specified anything'
        })
        break
      }
      if (body) {
        console.error('Failed to parserequest. HTTP request body conflict.')
        continue
      }
      body = compactIfJson(tokens[i])
    }
  }

  if (!path) {
    console.error({ error: 'url is not specified' })
    path = '/'
  }
  if (!method) {
    method = 'GET'
  }
  return { method, path, header, body }
}

function urlParser(token: string): string {
  const urlParts = token.split('/')
  if (urlParts.length < 4) {
    return '/'
  }
  return `/${urlParts.slice(3).join('/')}`
}

function headerParser(token: string): {
  key: string | undefined
  value: string
} {
  if (!/^[a-zA-Z0-9-]+:( )*/.test(token)) {
    console.error({
      error: 'Failed to parse request. HTTP header format is invalid.'
    })
    return { key: undefined, value: '' }
  }
  const devidedByColon = token.split(':')
  const key = devidedByColon[0]
  const value = devidedByColon.slice(1).join(':').trim()
  return { key, value }
}

function tokenizer(argString: string): string[] {
  const tokens: string[] = []
  let tokenBegin = 0
  let inner: '"' | "'" | undefined

  let str = `${argString} `
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === ' ' || str[i] === '\n' || str[i] === '\t') {
      if (!inner) {
        const token = str.slice(tokenBegin, i)
        if (token.length > 0) {
          tokens.push(token)
        }
        tokenBegin = i + 1
      }
      continue
    }
    if (str[i] === '\\') {
      if (str[i + 1] === '\\') {
        // \\ -> \
        str = deleteTheCharactor(str, i)
        // not decrement i here
      } else {
        str = deleteTheCharactor(str, i)
        i -= 1
      }
      continue
    }
    if (str[i] === '"') {
      if (inner === undefined) {
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = '"'
      } else if (inner === '"') {
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = undefined
      }
    }
    if (str[i] === "'") {
      if (inner === undefined) {
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = "'"
      } else if (inner === "'") {
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = undefined
      }
    }
  }
  return tokens
}

function deleteTheCharactor(word: string, idx: number) {
  const head = word.slice(0, idx)
  const tail = word.slice(idx + 1)
  return head + tail
}

function compactIfJson(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body))
  } catch {
    return body
  }
}

export { requestParser, tokenizer, headerParser, compactIfJson }
