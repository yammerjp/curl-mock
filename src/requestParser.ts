function requestParser(curlCmdStr: string, port: string): Request|undefined {
  let path: string|undefined
  const header: {[key:string]: string} = {}
  const tokens = tokenizer(curlCmdStr)
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    console.error({ error: 'request is invalid format (need "curl" on head)' })
    return
  }
  for(let i = 0; i < tokens.length; i++) {
    if (/^http(s)?:\/\//.test(tokens[i])) {
      if (path) {
        console.error({error: 'specifying url is duplicated'})
        continue
      }
      const urlParts = tokens[i].split('/')
      if (urlParts.length < 4) {
        path = '/'
        continue
      }
      path = '/' + urlParts.slice(3).join('/')
      continue
    }

    if (tokens[i] === '--header' || tokens[i] === '-H') {
      i++
      if (i===tokens.length) {
        console.error({error: 'Failed to parse request. last token is HTTP header option but it is not specified anything'})
        break
      }
      if (!/^[a-zA-Z0-9\-]+:( )*/.test(tokens[i])) {
        console.error({error: 'Failed to parse request. HTTP header format is invalid.'})
        continue
      }
      const devidedByColon = tokens[i].split(':')
      const key = devidedByColon[0]
      const value = devidedByColon.slice(1).join(':').trim()

      if (header[key]) {
        console.error('Failed to parserequest. Headers conflict.')
        continue
      }
      header[key] = value
    }
  }

  if (!path) {
    console.error({error: 'url is not specified'})
    path = '/'
  }
  return { path, port, header}
}

function tokenizer(str: string): string[] {
    const tokens: string[] = []
    let tokenBegin = 0
    let inner: '"'|"'"|undefined = undefined

    str = str + ' '
    for(let i = 0; i < str.length; i++) {
        if (str[i] === ' ') {
            if (!inner) {
                const token = str.slice(tokenBegin, i)
                if (token.length > 0) {
                    tokens.push(token)
                }
                tokenBegin = i+1
            }
            continue
        }
        if (str[i] === '\\') {
            if (str[i+1] === '\\') {
                // \\ -> \
                str = deleteTheCharactor(str, i)
                // not decrement i here
            } else {
                str = deleteTheCharactor(str, i)
                i--
            }
            continue
        }
        if (str[i] === '"') {
            if (inner === undefined) {
                str = deleteTheCharactor(str, i)
                i--
                inner = '"'
            } else if (inner === '"') {
                str = deleteTheCharactor(str, i)
                i--
                inner = undefined
            } else {}
        }
        if (str[i] === "'") {
            if (inner === undefined) {
                str = deleteTheCharactor(str, i)
                i--
                inner = "'"
            } else if (inner === "'") {
                str = deleteTheCharactor(str, i)
                i--
                inner = undefined
            } else {}
        }
   }
    return tokens
}

function deleteTheCharactor(word: string, idx: number) {
    const head = word.slice(0, idx)
    const tail = word.slice(idx+1)
    return head + tail
}

export { requestParser, tokenizer }
