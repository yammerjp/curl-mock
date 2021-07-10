function tokenizeCurlCommand(argString: string): string[] {
  const tokens: string[] = []
  let tokenBegin = 0
  let inner: '"' | "'" | undefined

  let str = `${argString} `
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === ' ' || str[i] === '\n' || str[i] === '\t') {
      if (inner) {
        // skip charactor
        continue
      }
      // split token
      const token = str.slice(tokenBegin, i)
      if (token.length > 0) {
        tokens.push(token)
      }
      tokenBegin = i + 1
      continue
    }

    if (str[i] === '\\') {
      // delete back-slash and skip next charactor
      str = deleteTheCharactor(str, i)
      continue
    }

    if (str[i] === '"') {
      if (inner === undefined) {
        // start of " ... "
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = '"'
      } else if (inner === '"') {
        // end of " ... "
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = undefined
      }
      continue
    }

    if (str[i] === "'") {
      if (inner === undefined) {
        // start of ' ... '
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = "'"
      } else if (inner === "'") {
        // end of ' ... '
        str = deleteTheCharactor(str, i)
        i -= 1
        inner = undefined
      }
      continue
    }
  }

  if (inner === '"') {
      throw new Error('Double-quotation is not closed')
  }
  if (inner === "'") {
      throw new Error('Single-quotation is not closed')
  }

  return tokens
}

function deleteTheCharactor(word: string, idx: number): string {
  const head = word.slice(0, idx)
  const tail = word.slice(idx + 1)
  return head + tail
}

export { tokenizeCurlCommand, deleteTheCharactor }
