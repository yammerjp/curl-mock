import { mockServer } from './mockServer'
import readFile from './readFile'
import createEndpointFromBlocks from './createEndpoint'

async function createEndpoints(documentPaths: string[]): Promise<Endpoint[]> {
  const blocks = (await Promise.all(documentPaths.map(readFile))).flat()
  return createEndpointFromBlocks(blocks)
}

async function server(port: number, documentPaths: string[]): Promise<boolean> {
  const endpoints = await createEndpoints(documentPaths)
  try {
    mockServer(endpoints, port)
    return true
  } catch {
    return false
  }
}

export { server, createEndpoints }