import { mockServer } from './mockServer'
import readFile from './readFile'
import createEndpointFromBlocks from './createEndpoint'

async function main() {
  const documentPath = 'example/helloworld.md'
  const port = 3000

  const blocks = await readFile(documentPath)
  const endpoints = createEndpointFromBlocks(blocks)
  mockServer(endpoints, port)
}

main()
