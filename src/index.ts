import fs from 'fs/promises'
import type { Server } from 'http'

import documentProcessor from './documentProcessor'
import serverBuilder from './serverBuilder'
import type { Endpoint } from './endpoint'

async function createEndpoints(documentPaths: string[]): Promise<Endpoint[]> {
  const markdowns = await Promise.all(documentPaths.map((path) => fs.readFile(path, 'utf-8')))
  const endpoints = documentProcessor(markdowns)
  return endpoints
}

async function server(port: number, documentPaths: string[]): Promise<Server> {
  const endpoints = await createEndpoints(documentPaths)
  return  serverBuilder(endpoints, port)
}

export { server, createEndpoints }
