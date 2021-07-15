import remark from 'remark'
import type { ResponseType } from '../endpoint'

type CodeBlock = {
  type: 'request' | ResponseType
  value: string
}

type EndpointWithString = {
  request: string
  response: string
  responseType: ResponseType
}

type Node = {
  type: string
  lang?: string
  value?: string
  children: Node[]
}

const { parse } = remark()

function extractCurldocCodeBlock(markdown: string): CodeBlock[] {
  const tree = parse(markdown)
  const markdownBlocks = (tree as Node).children
  const BlocksIncludeUndefined: Array<CodeBlock | undefined> = markdownBlocks.map(
    (mdb: Node): CodeBlock | undefined => {
      if (mdb.type !== 'code') {
        return undefined
      }
      const { value } = mdb
      if (mdb.lang === 'curldoc-request' && value !== undefined) {
        return {
          type: 'request',
          value
        }
      }
      if (mdb.lang === 'curldoc-response' && value !== undefined) {
        return {
          type: 'response',
          value
        }
      }
      if (mdb.lang === 'curldoc-response-include' && value !== undefined) {
        return {
          type: 'response-include',
          value
        }
      }

      return undefined
    }
  )

  return BlocksIncludeUndefined.filter((b) => b) as CodeBlock[]
}

function codeBlocks2EndpointsWithString(codeBlocks: CodeBlock[]): EndpointWithString[] {
  let request: string | undefined
  const endpointsWithString: EndpointWithString[] = []

  for (const b of codeBlocks) {
    if (b.type === 'request') {
      if (request) {
        throw new Error('request block is duplicated')
      }
      request = b.value
      continue
    }

    if (b.type === 'response' || b.type === 'response-include') {
      if (!request) {
        throw new Error('request is not defined')
      }
      endpointsWithString.push({
        request,
        response: b.value,
        responseType: b.type
      })
      request = undefined
      continue
    }
    throw new Error('Unknown block type')
  }
  return endpointsWithString
}

function disassembleMarkdown(markdown: string): EndpointWithString[] {
  const codeBlocks = extractCurldocCodeBlock(markdown)
  return codeBlocks2EndpointsWithString(codeBlocks)
}

export { disassembleMarkdown, extractCurldocCodeBlock, codeBlocks2EndpointsWithString }
