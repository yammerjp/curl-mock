function tokenizeCurlCommand(argString: string): string[] {
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

function deleteTheCharactor(word: string, idx: number): string {
  const head = word.slice(0, idx)
  const tail = word.slice(idx + 1)
  return head + tail
}

export { tokenizeCurlCommand, deleteTheCharactor }
