import { mockServer } from './mockServer'
import readFile from './readFile'
import createEndpointFromBlocks from './createEndpoint'

async function main() {
  let port = 3000
  const documentPaths: string[] = []
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i+=1) {
    if ((args[i] === '-p' || args[i] === '--port')) {
      if (i+1 >= args.length) {
        console.error({error: 'Failed to read command-line arguments'})
        break
      }
      i+=1
      port = Number(args[i])
      continue
    }
    documentPaths.push(args[i])
  }
  if (documentPaths.length === 0) {
    console.error('Usage: curldoc <markdown file path> (--port <TCP port)')
    return
  }

  const blocks = (await Promise.all(documentPaths.map(readFile))).flat()
  const endpoints = createEndpointFromBlocks(blocks)
  mockServer(endpoints, port)
}

main()
