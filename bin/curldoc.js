#!/usr/bin/env node
/* eslint-disable import/extensions */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const curldoc = require('../dist/index.js');

const parseProcessArgv = () => {
  let port = 3000
  const documentPaths = []
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '-p' || args[i] === '--port') {
      if (i + 1 >= args.length) {
        console.error({ error: 'Failed to read command-line arguments' })
        break
      }
      i += 1
      port = Number(args[i])
      continue
    }
    documentPaths.push(args[i])
  }
  if (documentPaths.length === 0) {
    console.error('Usage: curldoc (--port <TCP port>) <markdown file paths ... >')
    process.exit(1)
  }
  return {port, documentPaths}
}


const { port, documentPaths } = parseProcessArgv()
curldoc.server(port, documentPaths)

