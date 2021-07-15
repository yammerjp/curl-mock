import { disassembleMarkdown } from './disassembleMarkdown'
import { parseCurlCommand } from './parseCurlCommand'
import { parseResponse } from './parseResponse'
import type { Endpoint } from '../endpoint'

function documentProcessor(markdowns: string[]): Endpoint[] {
  const endpointsWithString = markdowns.flatMap((md) => disassembleMarkdown(md))
  const endpoints: Endpoint[] = endpointsWithString.map((endpointWithString) => ({
    request: parseCurlCommand(endpointWithString.request),
    response: parseResponse(endpointWithString.response, endpointWithString.responseType)
  }))
  return endpoints
}

export default documentProcessor
