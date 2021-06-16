import mockServer from './mockServer'
import readFile from './readFile'
import createEndpointFromBlocks from './createEndpoint'

async function main() {
  const blocks = await readFile('example/helloworld.md')

  const endpoints = createEndpointFromBlocks(blocks)

  mockServer.endpoints = endpoints

  mockServer.start()
}

main()