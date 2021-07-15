import fs from 'fs/promises'

import documentProcessor from './documentProcessor'
import serverBuilder from './serverBuilder'
import type { Endpoint } from './endpoint'

async function createEndpoints(documentPaths: string[]): Promise<Endpoint[]> {
  const markdowns = await Promise.all(documentPaths.map((path) => fs.readFile(path, 'utf-8')))
  const endpoints = documentProcessor(markdowns)
  return endpoints
}

async function server(port: number, documentPaths: string[]): Promise<boolean> {
  const endpoints = await createEndpoints(documentPaths)
  try {
    serverBuilder(endpoints, port)
    return true
  } catch {
    return false
  }
}

export { server, createEndpoints }
