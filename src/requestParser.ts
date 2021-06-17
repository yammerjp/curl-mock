function requestParser(curlCmdStr: string, port: string): Request|undefined {
    // TODO: user tokenizer(str)
  const tokens = curlCmdStr.split(' ')
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    console.error({ error: 'request is invalid format (need "curl" on head)' })
    return
  }
  const url = tokens.find(t => /^http:\/\/localhost(:\d+)?/.test(t))
  if (!url) {
      console.error({ error: 'request is invalid format (need url' })
    return
  }
  const pathParts = url.split('/').slice(3)
  let path = ''
  if (pathParts === undefined || pathParts.length === 0) {
    path = '/'
  } else {
    path = '/' + pathParts.join('/')
  }
  return { path, port }
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
